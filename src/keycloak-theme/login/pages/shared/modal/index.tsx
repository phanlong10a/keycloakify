import { FC, ReactNode } from 'react';
import * as ReactDOM from 'react-dom';
import { Modal } from './Modal';
import { GenericI18n } from 'keycloakify/login/i18n/i18n';

interface IPropsModalComponent {
  isOpen: boolean;
  title?: ReactNode;
  children?: ReactNode;
  handleClose?: () => void;
  handleOk?: () => void;
  i18n: GenericI18n<any>
  afterClose?: () => void;
}

export const ModalComponent: FC<IPropsModalComponent> = ({ children, isOpen, title, handleClose, handleOk, i18n }) => {
  return ReactDOM.createPortal(
    <Modal
      closable={false}
      title={title}
      cancelButtonProps={{ style: { display: !handleClose ? 'none' : 'inline-block' } }}
      okButtonProps={{ style: { display: !handleOk ? 'none' : 'inline-block' } }}
      visible={isOpen}
      onCancel={handleClose}
      onOk={handleOk}
      i18n={i18n}
    >
      {children}
    </Modal>,
    document.body,
  );
};
