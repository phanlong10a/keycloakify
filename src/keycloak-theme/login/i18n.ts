import { createUseI18n } from "keycloakify/login";

export const { useI18n } = createUseI18n({
  // NOTE: Here you can override the default i18n messages
  // or define new ones that, for example, you would have
  // defined in the Keycloak admin UI for UserProfile
  // https://user-images.githubusercontent.com/6702424/182050652-522b6fe6-8ee5-49df-aca3-dba2d33f24a5.png
  en: {
    alphanumericalCharsOnly: "Only alphanumerical characters",
    gender: "Gender",
    // Here we overwrite the default english value for the message "doForgotPassword"
    // that is "Forgot Password?" see: https://github.com/InseeFrLab/keycloakify/blob/f0ae5ea908e0aa42391af323b6d5e2fd371af851/src/lib/i18n/generated_messages/18.0.1/login/en.ts#L17
    doForgotPassword: "I forgot my password",
    loginTitle: "Login",
    requiredField: "This field is required!",
    maxLength: "This field must no more than {{count}} characters",
    notValidEmail: "Email not formatted correctly",
    invalidUserMessage: "Invalid username or password",
    error500: "Internal Server Error",
    authPasscode: "G-Auth Passcode (If any)",
    passcode: "Passcode",
    notRegisterHMAC: "You have not registered for G-Auth Service",
    googleAuthentication: "GOOGLE AUTHENTICATION SERVICE",
    scanQRCode: "Scan this QR Code Google Authenticator App",
    scanQRCodeContinue: "and enter that code into the field below",
    buttonSendConfirmationCode: "Active",
    buttonCancel: "Cancel",
    titleConfirmation: "Confirmation",
    contentCancelConfirm: "Are you sure you want to cancel this action?",
    buttonYes: "Yes",
    buttonNo: "No",
    successfullyActived: "Successfully Activated!",
    buttonDone: "Done",
  },
});

export type I18n = NonNullable<ReturnType<typeof useI18n>>;
