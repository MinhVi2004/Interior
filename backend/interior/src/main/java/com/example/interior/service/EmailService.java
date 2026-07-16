package com.example.interior.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

	private final ObjectProvider<JavaMailSender> mailSenderProvider;
	private final String from;
	private final String defaultTo;

	public EmailService(ObjectProvider<JavaMailSender> mailSenderProvider,
						 @Value("${spring.mail.username:}") String from,
						 @Value("${app.contact.to:}") String defaultTo) {
		this.mailSenderProvider = mailSenderProvider;
		this.from = from;
		this.defaultTo = defaultTo;
	}

	public void sendSimpleMail(String to, String subject, String text) {
		JavaMailSender mailSender = mailSenderProvider.getIfAvailable();
		String resolvedTo = (to == null || to.isBlank()) ? defaultTo : to;
		if (mailSender == null || from == null || from.isBlank() || resolvedTo == null || resolvedTo.isBlank()) {
			return;
		}
		SimpleMailMessage message = new SimpleMailMessage();
		message.setFrom(from);
		message.setTo(resolvedTo);
		message.setSubject(subject);
		message.setText(text);
		mailSender.send(message);
	}

	public void sendContactMail(String name, String email, String messageText) {
		sendSimpleMail(defaultTo, "Contact from " + name, messageText + "\nFrom: " + email);
	}
}