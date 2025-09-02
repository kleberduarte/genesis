package com.genesis.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ValidacaoException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> handleValidacao(ValidacaoException ex) {
        return Map.of("message", ex.getMessage());
    }

    @ExceptionHandler(RecursoNaoEncontradoException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String, String> handleNaoEncontrado(RecursoNaoEncontradoException ex) {
        return Map.of("message", ex.getMessage());
    }

    // Opcional: qualquer outro erro não tratado
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public Map<String, String> handleOutros(Exception ex) {
        return Map.of("message", "Erro inesperado: " + ex.getMessage());
    }
}
