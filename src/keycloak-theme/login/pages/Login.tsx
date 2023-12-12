import { useState, type FormEventHandler } from "react";
import { clsx } from "keycloakify/tools/clsx";
import { useConstCallback } from "keycloakify/tools/useConstCallback";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { useGetClassName } from "keycloakify/login/lib/useGetClassName";
import type { KcContext } from "../kcContext";
import type { I18n } from "../i18n";
import { Button, Form, Input } from "antd";
import './Login.css'
import { BaseFormItem } from "./shared/component";

export default function Login(props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { getClassName } = useGetClassName({
        doUseDefaultCss,
        classes
    });

    const { social, realm, url, usernameHidden, login, auth, registrationDisabled } = kcContext;

    const { msg, msgStr } = i18n;

    const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);

    const onSubmit = useConstCallback<FormEventHandler<HTMLFormElement>>(e => {
        setIsLoginButtonDisabled(true);
        const formElement = document.getElementById('kc-form-login') as HTMLFormElement
        if (!formElement) return
        //NOTE: Even if we login with email Keycloak expect username and password in
        //the POST request.
        formElement.querySelector("input[name='email']")?.setAttribute("name", "username");

        formElement.submit();
    });

    return (
        <Template
            {...{ kcContext, i18n, doUseDefaultCss, classes }}
            displayInfo={social.displayInfo}
            displayWide={realm.password && social.providers !== undefined}
            headerNode={msg("doLogIn")}
        >
            <div id="kc-form" className={clsx(realm.password && social.providers !== undefined && getClassName("kcContentWrapperClass"))}>
                <div
                    id="kc-form-wrapper"
                    className={clsx(
                        realm.password &&
                        social.providers && [getClassName("kcFormSocialAccountContentClass"), getClassName("kcFormSocialAccountClass")]
                    )}
                >
                    <div className="login-title">
                        {msg('loginTitle')}
                    </div>
                    {realm.password && (
                        <Form id="kc-form-login" layout="vertical" onFinish={onSubmit} action={url.loginAction} method="post">
                            <div className={getClassName("kcFormGroupClass")}>
                                {!usernameHidden &&
                                    (() => {
                                        const label = "email";
                                        const autoCompleteHelper = label;
                                        return (
                                            <>
                                                <BaseFormItem
                                                    name="email"
                                                    label={msg(label)}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            validator: (_: any, value: any) => {
                                                              return (![undefined, null].includes(value) ? value : '').toString().trim() !== ''
                                                                ? Promise.resolve()
                                                                : Promise.reject(new Error(msgStr('requiredField')));
                                                            },
                                                          },
                                                          { max: 255, message: msgStr('maxLength') },
                                                          {
                                                            type: 'email',
                                                            message: msgStr('notValidEmail'),
                                                          },
                                                    ]}
                                                >
                                                    <Input
                                                        tabIndex={1}
                                                        placeholder={msgStr(label)}
                                                        id={autoCompleteHelper}
                                                        //NOTE: This is used by Google Chrome auto fill so we use it to tell
                                                        //the browser how to pre fill the form but before submit we put it back
                                                        //to username because it is what keycloak expects.
                                                        name={autoCompleteHelper}
                                                        defaultValue={login.username ?? ""}
                                                        type="text"
                                                        autoFocus={true}
                                                        autoComplete="off"
                                                    />
                                                </BaseFormItem>
                                                {/* <label htmlFor={autoCompleteHelper} className={getClassName("kcLabelClass")}>
                                                    <span style={{ color: '#ff4d4f', marginRight: 4 }}>*</span> {msg(label)}
                                                </label>
                                                <Input
                                                    tabIndex={1}
                                                    placeholder={msgStr(label)}
                                                    id={autoCompleteHelper}
                                                    //NOTE: This is used by Google Chrome auto fill so we use it to tell
                                                    //the browser how to pre fill the form but before submit we put it back
                                                    //to username because it is what keycloak expects.
                                                    name={autoCompleteHelper}
                                                    defaultValue={login.username ?? ""}
                                                    type="text"
                                                    autoFocus={true}
                                                    autoComplete="off"
                                                /> */}
                                            </>
                                        );
                                    })()}
                            </div>
                            <div className={getClassName("kcFormGroupClass")}>
                                <BaseFormItem
                                    name="password"
                                    label={msg("password")}
                                    rules={[
                                        {
                                            required: true,
                                            validator: (_: any, value: any) => {
                                                return (![undefined, null].includes(value) ? value : '').toString().trim() !== ''
                                                    ? Promise.resolve()
                                                    : Promise.reject(new Error(msgStr('requiredField')));
                                            },
                                        },
                                    ]}
                                >
                                    <Input.Password
                                    tabIndex={2}
                                    placeholder={msgStr('password')}
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="off"
                                />
                                </BaseFormItem>
                               
                            </div>
                            <div id="kc-form-buttons" className={getClassName("kcFormGroupClass")}>
                                <input
                                    type="hidden"
                                    id="id-hidden-input"
                                    name="credentialId"
                                    {...(auth?.selectedCredential !== undefined
                                        ? {
                                            "value": auth.selectedCredential
                                        }
                                        : {})}
                                />
                                <Button
                                    tabIndex={3}
                                    name="login"
                                    id="kc-login"
                                    htmlType="submit"
                                    type="primary"
                                    disabled={isLoginButtonDisabled}
                                >
                                    {msgStr("loginTitle")}
                                </Button>
                            </div>
                        </Form>
                    )}
                </div>
            </div>
        </Template>
    );
}
