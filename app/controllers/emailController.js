const services = require("../../services");
const { validators, escapeHTML } = require("../../utils");

const sendEmails = async (req, res) => {
  const { listID, templateID, campaignID, to } = req.body;

  const template = await services.template.getTemplateById(
    templateID,
    req.user
  );
  if (!template)
    return res.status(400).send({ error: "Couldn't find template", template });

  let response = { sent: 0, delivered: 0, bounced: 0 };
  if (to) {
    if (!validators.email(to))
      return res.status(500).send({ error: "Invalid Email" });
    response = await services.email.sendMail(
      { email: to },
      template,
      getTransformedBody(template),
      req.user
    );
    if (
      ((response.error && response.error.statusCode) ||
        (response.response && response.response.status)) === 401
    )
      return res.status(401).send({
        error: "Mailjet API key authentication/authorization failure",
      });
  } else {
    let { subscribers } = await services.list.getListDetailsById(listID, true);
    if (!subscribers.length)
      return res
        .status(400)
        .send({ error: "Empty subscriber list", subscribers });

    const analytics = await services.analytics.createNewAnalytics(campaignID, {
      sent: [],
      delivered: [],
      bounced: [],
      open: [],
    });

    if (!analytics)
      return res.status(500).send({ error: "Internal Server Error" });

    for (subscriber of subscribers) {
      if (!subscriber.subscribed) continue;
      const resp = await services.email.sendMail(
        subscriber._doc,
        template,
        getTransformedBody(template, req),
        req.user,
        analytics._id
      );

      if (
        ((resp.error && resp.error.statusCode) ||
          (resp.response && resp.response.status)) === 401
      )
        return res.status(401).send({
          error: "Mailjet API key authentication/authorization failure",
        });
    }
  }

  if (response.error) {
    console.log(JSON.stringify(response.error, null, 2));
    return res.status(500).send({ error: "Internal Server Error" });
  }
  res.send(response);
};

function getTransformedBody({ body, bodyType, analytics }, req) {
  let result = { TextPart: "", HTMLPart: "" };
  //result[`${bodyType === 1 ? "HTML" : "Text"}Part`] = body + "";
  result.HTMLPart = `${
    bodyType === 1 ? body : escapeHTML(body)
  }<br>`;

  if (analytics && req) {
    const serverUrl = req.protocol + "://" + req.get("host");
    analytics.forEach((el) => {
      switch (el) {
        case 2:
          //result += `<a  href="[[UNSUB_LINK]]" >Unsubscribe</a>`;
          result.HTMLPart += `<a  href="${serverUrl}/api/subscriber/unsubscribe/${subscriber._doc._id}" >Unsubscribe</a>`;
          break;
        case 0:
          result.HTMLPart += `<img style="display:none;" src="${serverUrl}/api/analytics/img?sub=${subscriber._doc._id}" >`;
          break;
      }
    });
  }
  return result;
}

module.exports = { sendEmails };
