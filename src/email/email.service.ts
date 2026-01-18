import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT') || 587,
      secure: this.configService.get<boolean>('SMTP_SECURE') || false,
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
  }

  async sendActivationEmail(email: string, activationToken: string, firstName: string) {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5174';
    const activationLink = `${frontendUrl}/activate?token=${activationToken}`;

    const mailOptions = {
      from: this.configService.get<string>('SMTP_FROM'),
      to: email,
      subject: 'Activation de votre compte Mboka Ride',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Bonjour ${firstName},</h2>
          <p>Merci de vous être inscrit sur Mboka Ride.</p>
          <p>Pour activer votre compte, veuillez cliquer sur le lien ci-dessous :</p>
          <p style="margin: 30px 0;">
            <a href="${activationLink}" 
               style="background-color: #007bff; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              Activer mon compte
            </a>
          </p>
          <p>Ou copiez ce lien dans votre navigateur :</p>
          <p style="color: #666; word-break: break-all;">${activationLink}</p>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            Ce lien est valide pendant 48 heures. Si vous n'avez pas créé de compte, 
            vous pouvez ignorer cet email.
          </p>
        </div>
      `,
    };

    return await this.transporter.sendMail(mailOptions);
  }
}