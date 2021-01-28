const _ = require("lodash");
const settingsServices = require("./settingsServices");

const sendMail = async (subscriber, template, body, user, analyticsID) => {
  try {
    const settings = await settingsServices.getSettings(user._id);
    const mailjet = require("node-mailjet").connect(
      (settings || {}).MailjetUsername,
      (settings || {}).MailjetPassword
    );
    const response = await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: template.fromEmail,
            Name: template.fromName,
          },
          To: [
            {
              Name: subscriber.name,
              Email: subscriber.email,
            },
          ],
          Subject: template.subject,
          EventPayload: JSON.stringify({ subscriber, analyticsID }),
          ...body,
        },
      ],
    });

    //console.log(JSON.stringify(response, null, 2));
    return response;
  } catch (error) {
    console.log(JSON.stringify(error, null, 2));
    return { error };
  }
};

module.exports = {
  sendMail,
};
