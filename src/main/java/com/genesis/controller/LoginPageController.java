package com.genesis.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class LoginPageController {

    @GetMapping("/login")
    public String mostrarLogin() {
        return "login"; // redireciona para login.html
    }
}