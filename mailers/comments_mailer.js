const nodeMailer = require('../config/nodemailer');


// this is another way of exporting a method
exports.newComment = (data) => {
    let htmlString = nodeMailer.renderTemplate({data: data}, '/comments/new_comment.ejs');

    nodeMailer.transporter.sendMail({
       from: "kirtidabas_2k18co176@dtu.ac.in",
       to: data.to,
       subject: "lets connect!",
       html: htmlString
    }, (err, info) => {
        if (err){
            console.log('Error in sending mail', err);
            return;
        }

        // console.log('Message sent', info);
        return;
    });
}