import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

group = "com.copmCorda"
version = "2.0.0-rc.7"
java.sourceCompatibility = JavaVersion.VERSION_17

repositories {
    mavenCentral()
    maven { url = uri("https://repo.spring.io/milestone") }
}

tasks.withType<KotlinCompile> {
    kotlinOptions.jvmTarget = "17"
}

plugins {
    val kotlinVersion = "1.7.10"
    id("org.jetbrains.kotlin.jvm") version kotlinVersion
    id("org.jetbrains.kotlin.plugin.jpa") version kotlinVersion
    id("org.jetbrains.kotlin.plugin.spring") version kotlinVersion
    id("org.springframework.boot") version "3.0.2"
    id("io.spring.dependency-management") version "1.0.14.RELEASE"
}

dependencies {
    implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")
    implementation("org.jetbrains.kotlin:kotlin-reflect")
        implementation("org.springframework.boot:spring-boot-starter-web")

    implementation("com.google.code.findbugs:jsr305:3.0.2")
    implementation("com.fasterxml.jackson.dataformat:jackson-dataformat-yaml")
    implementation("com.fasterxml.jackson.dataformat:jackson-dataformat-xml")
    implementation("com.fasterxml.jackson.datatype:jackson-datatype-jsr310")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
    implementation("jakarta.validation:jakarta.validation-api")
    implementation("jakarta.annotation:jakarta.annotation-api:2.1.0")
    implementation(files("./../../../weaver/common/protos-java-kt/build/libs/protos-java-kt-2.0.0-rc.7.jar"))
    implementation(files("./../../../weaver/sdks/corda/build/libs/weaver-sdk-corda-2.0.0-rc.7.jar"))
    implementation(files("./../../../weaver/core/network/corda-interop-app/interop-workflows/build/libs/interop-workflows-2.0.0-rc.7.jar"))
    implementation(files("./../../../weaver/core/network/corda-interop-app/interop-contracts/build/libs/interop-contracts-2.0.0-rc.7.jar"))
    implementation(files("./../../../weaver/samples/corda/corda-simple-application/contracts-kotlin/build/libs/contracts-kotlin-0.4.jar"))
    implementation(files("./../../../weaver/samples/corda/corda-simple-application/workflows-kotlin/build/libs/workflows-kotlin-0.4.jar"))


    testImplementation("org.jetbrains.kotlin:kotlin-test-junit5")
    testImplementation("org.springframework.boot:spring-boot-starter-test") {
        exclude(module = "junit")
    }
}
