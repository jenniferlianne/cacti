package com.copmCorda

import org.springframework.boot.runApplication
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.context.annotation.ComponentScan

@SpringBootApplication
@ComponentScan(basePackages = ["com.copmCorda", "com.copmCorda.server.api", "com.copmCorda.server.model"])
class Application

fun main(args: Array<String>) {
    runApplication<Application>(*args)
}
