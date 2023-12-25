FROM node:18-alpine as build
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
# COPY . .
RUN yarn build-keycloak-theme

FROM quay.io/keycloak/keycloak:23.0.3
WORKDIR /opt/keycloak
COPY --from=build /app/build_keycloak/target/keycloakify-starter-keycloak-theme-5.0.5.jar /opt/keycloak/providers/keycloakify-starter-keycloak-theme-5.0.5.jar
COPY --from=build /app/build_keycloak/src/main/resources/theme/account-v1 /opt/keycloak/themes/account-v1
COPY --from=build /app/build_keycloak/src/main/resources/theme/keycloakify-starter /opt/keycloak/themes/keycloakify-starter
COPY --from=build /app/build_keycloak/src/main/resources/theme/keycloakify-starter-variant-1 /opt/keycloak/themes/keycloakify-starter-variant-1
COPY --from=build /app/build_keycloak/src/main/resources/theme/keycloakify-starter-variant-1_retrocompat /opt/keycloak/themes/keycloakify-starter-variant-1_retrocompat
COPY --from=build /app/build_keycloak/src/main/resources/theme/keycloakify-starter_retrocompat /opt/keycloak/themes/keycloakify-starter_retrocompat

CMD start-dev --features=declarative-user-profile

# COPY --from=build /app/build_keycloak/src/main/resources/theme/account-v1 "/opt/keycloak/themes/account-v1":rw
# COPY --from=build /app/build_keycloak/src/main/resources/theme/keycloakify-starter "/opt/keycloak/themes/keycloakify-starter":rw
# COPY --from=build /app/build_keycloak/src/main/resources/theme/keycloakify-starter-variant-1 "/opt/keycloak/themes/keycloakify-starter-variant-1":rw
# COPY --from=build /app/build_keycloak/src/main/resources/theme/keycloakify-starter-variant-1_retrocompat "/opt/keycloak/themes/keycloakify-starter-variant-1_retrocompat":rw
# COPY --from=build /app/build_keycloak/src/main/resources/theme/keycloakify-starter_retrocompat "/opt/keycloak/themes/keycloakify-starter_retrocompat":rw

# CMD start-dev --features=declarative-user-profile


