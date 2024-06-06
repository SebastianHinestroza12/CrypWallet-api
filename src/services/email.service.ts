// email.service.ts
import nodemailer, { Transporter } from 'nodemailer';
import { EmailOptions } from '../interfaces/email.interface';
import { promises as fs } from 'fs';
import { resolve } from 'path';

class EmailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendMail(options: EmailOptions): Promise<void> {
    try {
      await this.transporter.sendMail(options);
      console.log('Correo enviado💯');
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      throw error;
    }
  }

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    try {
      const templatePath = resolve(__dirname, '../template/welcome_email_template.html');
      const template = await fs.readFile(templatePath, 'utf-8');
      const htmlContent = template.replace('{{name}}', name);

      const emailOptions: EmailOptions = {
        from: 'crypwallet@yopmail.com',
        to: email,
        subject: '¡Tu aventura en el mundo de las criptomonedas comienza ahora! 🎉',
        html: htmlContent,
      };

      await this.sendMail(emailOptions);
    } catch (error) {
      console.error('Error al enviar el correo de bienvenida:', error);
      throw error;
    }
  }
}

export { EmailService };
