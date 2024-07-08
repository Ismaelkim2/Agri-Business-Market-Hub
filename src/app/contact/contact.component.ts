import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  contactForm: FormGroup;
  notification: { type: string, message: string } | null = null;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      subject: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      const templateParams = {
        from_name: this.contactForm.value.name,
        subject: this.contactForm.value.subject,
        email: this.contactForm.value.email,
        message: this.contactForm.value.message
      };

      emailjs.send('service_vitw26b', 'template_u15gdib', templateParams, 'npDIVJte9-5mYPuJ8')
        .then((response: EmailJSResponseStatus) => {
          console.log('Email sent successfully', response.status, response.text);
          this.notification = { type: 'success', message: 'Email sent successfully' };
          this.contactForm.reset();
          this.clearNotificationAfterDelay();
        }, (error) => {
          console.error('Failed to send email', error);
          this.notification = { type: 'error', message: 'Failed to send email. Please try again later.' };
          this.clearNotificationAfterDelay();
        });
    } else {
      this.notification = { type: 'error', message: 'Please fill out all required fields.' };
      this.clearNotificationAfterDelay();
    }
  }

  clearNotificationAfterDelay() {
    setTimeout(() => {
      this.notification = null;
    }, 4000); 
  }
}
