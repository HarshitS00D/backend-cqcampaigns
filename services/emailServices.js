const _ = require("lodash");
const settingsServices = require("./settingsServices");

const sendMail = async (subscriber, template, body, user) => {
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
              Name: subscriber._doc && subscriber._doc.name,
              Email: subscriber._doc.email,
            },
          ],
          Subject: template.subject,
          [`${template.bodyType === 1 ? "HTML" : "Text"}Part`]: body, //+ "[[UNSUB_LINK]]",
          EventPayload: JSON.stringify(subscriber),
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
