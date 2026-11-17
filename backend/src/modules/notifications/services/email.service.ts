import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.MAIL_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  async sendReservationConfirmation(
    email: string,
    guestName: string,
    propertyName: string,
    checkIn: Date,
    checkOut: Date,
    totalPrice: number,
  ) {
    const mailOptions = {
      from: process.env.MAIL_FROM || 'noreply@hotelmanagement.local',
      to: email,
      subject: `Reservation Confirmed - ${propertyName}`,
      html: `<h2>Reservation Confirmed!</h2>
        <p>Dear ${guestName},</p>
        <p>Your reservation at <strong>${propertyName}</strong> has been confirmed.</p>
        <ul>
          <li>Check-in: ${checkIn.toLocaleDateString()}</li>
          <li>Check-out: ${checkOut.toLocaleDateString()}</li>
          <li>Total: $${totalPrice.toFixed(2)}</li>
        </ul>`,
    };
    return this.transporter.sendMail(mailOptions);
  }

  async sendCancellationNotice(email: string, guestName: string, propertyName: string, refundAmount: number) {
    const mailOptions = {
      from: process.env.MAIL_FROM || 'noreply@hotelmanagement.local',
      to: email,
      subject: `Reservation Cancelled - ${propertyName}`,
      html: `<h2>Reservation Cancelled</h2>
        <p>Refund: $${refundAmount.toFixed(2)} within 5-7 days</p>`,
    };
    return this.transporter.sendMail(mailOptions);
  }
}
