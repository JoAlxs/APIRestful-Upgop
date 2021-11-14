import nodemailer = require('nodemailer');

export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'example@gmail.com', // Correo de escolares
      pass: 'password', // Password del correo
    },
});

transporter.verify().then(() => {
    console.log('Ready for send emails! :)')
})
