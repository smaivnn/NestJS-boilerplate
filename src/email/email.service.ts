import { EmailOptions } from './email.interface';
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendRegisterVerificationEmail(email: string) {
    const url = `${process.env.DOMAIN}:${process.env.PORT}/auth/activate/email?email=${email}`;

    const mailOptions: EmailOptions = {
      to: email,
      from: 'useremail@google.com',
      subject: '[테스트] 회원가입 인증 메일',
      text: '회원가입을 위한 인증 메일입니다.',
      html: `
        <h1>회원가입을 위한 인증 메일입니다.</h1>
        <p>아래 버튼을 클릭하여 회원가입을 완료해주세요.</p>
        <form action="${url}", method="post">
          <button type="submit">가입확인</button>
        </form>
        `,
    };

    this.mailerService
      .sendMail(mailOptions)
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
