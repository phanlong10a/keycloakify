import { CheckSquareOutlined } from '@ant-design/icons';
import { Button, Form, Image, Input, Row, Space, notification } from "antd";
import axios from "axios";
import { useGetClassName } from "keycloakify/login/lib/useGetClassName";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { clsx } from "keycloakify/tools/clsx";
import { useEffect, useState } from "react";
import type { I18n } from "../i18n";
import type { KcContext } from "../kcContext";
import './Login.css';
import { ActionsWrapper, BaseFormItem, ForgotPasswordText, WrapGoogleAuthencator, WrapGoogleAuthencatorSuccess } from "./shared/component";
import { ModalComponent } from "./shared/modal";

export interface LoginRequest {
    email?: string;
    password?: string;
    passcode?: string;
}
// const REACT_APP_ENDPOINT_URL = 'http://localhost:8001'
const REACT_APP_ENDPOINT_URL = 'https://cms-chatbot-be.gemvietnam.com'
const REACT_APP_AMS_URL = 'http://localhost:3001'

export default function Login(props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { getClassName } = useGetClassName({
        doUseDefaultCss,
        classes
    });

    const { social, realm, url, usernameHidden, auth } = kcContext;

    const { msg, msgStr } = i18n;

    const [loginRequest, setLoginRequest] = useState<LoginRequest>({});
    const [isOpenGoogleAuthenticator, setIsOpenGoogleAuthenticator] = useState<boolean>(false);
    const [qrCode, setQrCode] = useState<string>();
    const [labelCheck, setLabelCheck] = useState(false);

    const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);
    const [isOpenGoogleAuthenticatorSuccess, setIsOpenGoogleAuthenticatorSuccess] = useState<boolean>(false);
    const [isVerified, setIsVerified] = useState<boolean>(false)
    const [paramReset, setParamReset] = useState<string | null>(null)

    const checkLogin = async (values: LoginRequest, action: any) => {
        try {
            const { data } = await axios.post(REACT_APP_ENDPOINT_URL + `/auth/login/${action}`, {
                ...values
            })
            return data
        } catch (error: any) {
            if (!!error?.response?.data?.data) {
                throw error?.response?.data?.data?.message
            }
            else {
                throw msgStr('error500')
            }
        }
    }

    const getResetHmac = (params: string) => {
        const paramsRequest = params.replace('resetHmac=', '')
        setParamReset(paramsRequest)
        axios.post(REACT_APP_ENDPOINT_URL + `/auth/get-new-HMAC`, {
            key: paramsRequest,
        })
            .then((result: any) => {
                if (result?.data?.data) {
                    setQrCode(result?.data?.data.qrCode);
                    setLabelCheck(true);
                    setIsOpenGoogleAuthenticator(true);
                }
            })
            .catch((e: any) => notification.error({ message: e.message }))
            .finally(() => {
                setIsLoginButtonDisabled(false);
            });
    };

    useEffect(() => {
        const params = new URLSearchParams(document.location.search).get('login_hint');
        if (params?.includes('resetHmac')) {
            getResetHmac(params);
        }
    }, []);

    const onSubmit = async (values: LoginRequest, isConfirmForward = false, action: any) => {
        if (labelCheck && !!isConfirmForward) {
            try {
                const result = await axios.post(REACT_APP_ENDPOINT_URL + `/auth/submit-forgot-HMAC`, {
                    key: paramReset,
                    passCode: loginRequest?.passcode,
                });
                if (result.data?.status === 'success') {
                    setIsOpenGoogleAuthenticator(false);
                    setIsOpenGoogleAuthenticatorSuccess(true);
                }
            } catch (error: any) {
                notification.error({ message: error.message });
            } finally {
            }
            return
        }
        setIsLoginButtonDisabled(true);
        try {
            const response = await checkLogin(values, action)
            const { accessToken, qrCode } = response.data;
            if (qrCode) {
                notification.error({ message: msgStr('notRegisterHMAC') });
                setLoginRequest(values);
                setQrCode(qrCode);
                setIsOpenGoogleAuthenticator(true);
                return;
            }
            if (isConfirmForward) {
                setIsVerified(true);
                setIsOpenGoogleAuthenticator(false);
                return setIsOpenGoogleAuthenticatorSuccess(true);
            }
            if (accessToken) {
                const formElement = document.getElementById('kc-form-login') as HTMLFormElement
                if (!formElement) return
                formElement.querySelector("input[name='email']")?.setAttribute("name", "username");

                formElement.submit();
            }
        } catch (error: any) {
            typeof error == 'string' && notification.error({ message: error })
        } finally {
            setIsLoginButtonDisabled(false);
        }
    };


    const closeModal = () => {
        setLabelCheck(false);
    };


    const handleClose = () => {
        setIsOpenGoogleAuthenticator(false);
        setLabelCheck(false);
    };

    const handleConfirmForWard = async () => {
        if (labelCheck) {
            setLabelCheck(false);
            setIsOpenGoogleAuthenticatorSuccess(false);
            const loginRequestClone = { ...loginRequest };
            delete loginRequestClone.passcode;
            setLoginRequest(loginRequestClone);
            return;
        }
        if (!isVerified) return;
        const formElement = document.getElementById('kc-form-login') as HTMLFormElement
        if (!formElement) return
        formElement.querySelector("input[name='email']")?.setAttribute("name", "username");

        formElement.submit();
    };

    return (
        <Template
            {...{ kcContext, i18n, doUseDefaultCss, classes }}
            displayInfo={social.displayInfo}
            displayWide={realm.password && social.providers !== undefined}
            headerNode={msg("doLogIn")}
        >
            <ModalComponent
                title={
                    <Row justify={'center'}>
                        <span style={{ color: '#4284f5' }}>{msgStr('googleAuthentication')}</span>
                    </Row>
                }
                i18n={i18n}
                isOpen={isOpenGoogleAuthenticatorSuccess}
            >
                <WrapGoogleAuthencatorSuccess>
                    <Space className="text-content">
                        {/* @ts-ignore */}
                        <CheckSquareOutlined className="check-circle-outlined-icon" />
                        <span className='active-success'>{msgStr('successfullyActived')}</span>
                    </Space>
                    <Button style={{ width: '200px' }} onClick={handleConfirmForWard}>
                        {msgStr('buttonDone')}
                    </Button>
                </WrapGoogleAuthencatorSuccess>
            </ModalComponent>
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
                        <Form id="kc-form-login" layout="vertical" onFinish={(values: any) => {
                            onSubmit(values, false, null)
                        }} action={url.loginAction} method="post">
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
                                                    ]}
                                                >
                                                    <Input
                                                        tabIndex={1}
                                                        placeholder={msgStr(label)}
                                                        id={autoCompleteHelper}
                                                        name={autoCompleteHelper}
                                                        type="text"
                                                        autoFocus={true}
                                                        autoComplete="off"
                                                    />
                                                </BaseFormItem>

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
                            <div className={getClassName("kcFormGroupClass")}>
                                <BaseFormItem label={msg('authPasscode')} name="passcode">
                                    <Input placeholder={msgStr('passcode')} />
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
                                    loading={isLoginButtonDisabled}
                                    disabled={isLoginButtonDisabled}
                                >
                                    {msgStr("loginTitle")}
                                </Button>
                            </div>
                            <ActionsWrapper>
                                <a href={`${REACT_APP_AMS_URL}/forgot-password`}>
                                    <ForgotPasswordText>forgotPassword</ForgotPasswordText>
                                </a>
                                <a href={`${REACT_APP_AMS_URL}/forgot-hmac`}>
                                    <ForgotPasswordText>forgotHMAC</ForgotPasswordText>
                                </a>
                                <a href={`${REACT_APP_AMS_URL}/unlock`}>
                                    <ForgotPasswordText>unlockAccount</ForgotPasswordText>
                                </a>
                            </ActionsWrapper>
                        </Form>
                    )}
                </div>
                <ModalComponent
                    title={msgStr('googleAuthentication')}
                    isOpen={isOpenGoogleAuthenticator}
                    afterClose={closeModal}
                    i18n={i18n}
                >
                    <WrapGoogleAuthencator>
                        {qrCode && (
                            <div className="wrap-label">
                                <span>{msgStr('scanQRCode')}</span>
                                <Image src={qrCode} />
                                <span>{msgStr('scanQRCodeContinue')}</span>
                            </div>
                        )}
                        <Input
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                loginRequest && setLoginRequest({ ...loginRequest, passcode: e.target.value })
                            }
                            placeholder={msgStr('passcode')}
                        />
                        <Space>
                            <Button onClick={handleClose}>{msgStr('buttonCancel')}</Button>
                            <Button type="primary" onClick={() => loginRequest && onSubmit(loginRequest, true, 'active')}>
                                {msgStr('buttonSendConfirmationCode')}
                            </Button>
                        </Space>
                    </WrapGoogleAuthencator>
                </ModalComponent>
            </div>
        </Template>
    );
}
