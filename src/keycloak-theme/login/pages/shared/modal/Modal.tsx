import React from 'react';
import { Modal as AntModal, ModalProps as AntModalProps, ModalFuncProps } from 'antd';
import { modalSizes } from './Modal.styles';
import * as S from './Modal.styles';
import { GenericI18n } from 'keycloakify/login/i18n/i18n';

export const {
    info: InfoModal,
    success: SuccessModal,
    error: ErrorModal,
    warning: WarningModal,
    confirm: ConfirmModal,
} = AntModal;

export interface IConfirmProps extends ModalFuncProps {
    active: boolean;
}

interface ModalProps extends AntModalProps {
    size?: 'small' | 'medium' | 'large';
    onCancel?: (values: any) => void;
    confirmCancelProps?: IConfirmProps;
    onOk?: (values: any) => void;
    confirmOkProps?: IConfirmProps;
    i18n: GenericI18n<any>
}

export const Modal: React.FC<ModalProps> = ({
    size = 'medium',
    children,
    confirmCancelProps,
    confirmOkProps,
    onCancel: antOnCancel,
    onOk: antOnOk,
    i18n,
    ...props
}) => {
    const modalSize = Object.entries(modalSizes).find((sz) => sz[0] === size)?.[1];
    const { msg, msgStr } = i18n;

    const onCancel = (e: any) => {
        const props = {
            active: confirmCancelProps?.active || false,
            title: confirmCancelProps?.title || msgStr('titleConfirmation'),
            content: confirmCancelProps?.content || msgStr('contentCancelConfirm'),
            okText: confirmCancelProps?.okText || msgStr('buttonYes'),
            cancelText: confirmCancelProps?.cancelText || msgStr('buttonNo'),
            onOk: antOnCancel,
        };
        if (props?.active) ConfirmModal(props);
        else antOnCancel && antOnCancel(e);
    };

    const onOk = (e: any) => {
        const props = {
            active: confirmCancelProps?.active || false,
            title: confirmCancelProps?.title || msgStr('titleConfirmation'),
            content: confirmCancelProps?.content || msgStr('contentOkConfirm'),
            okText: confirmCancelProps?.okText || msgStr('buttonYes'),
            cancelText: confirmCancelProps?.cancelText || msgStr('buttonNo'),
            onOk: antOnOk,
        };
        if (props?.active) ConfirmModal(props);
        else antOnOk && antOnOk(e);
    };

    return (
        <S.Modal
            getContainer={false}
            width={modalSize}
            onCancel={onCancel}
            onOk={onOk}
            okText={props.okText || msgStr('buttonYes')}
            cancelText={props.cancelText || msgStr('buttonNo')}
            {...props}
        >
            {children}
        </S.Modal>
    );
};
