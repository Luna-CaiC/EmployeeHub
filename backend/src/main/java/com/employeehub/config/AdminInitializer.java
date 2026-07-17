package com.employeehub.config;

import com.employeehub.auth.entity.Role;
import com.employeehub.auth.entity.User;
import com.employeehub.auth.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(AdminInitializer.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.findByUsername("admin").isPresent()) {
            log.info("Administrator account already exists.");
            return;
        }

        User admin = new User(
                "admin",
                passwordEncoder.encode("Admin456!"),
                Role.ADMIN,
                true
        );
        userRepository.save(admin);
        log.info("Default administrator account created.");
    }
}
