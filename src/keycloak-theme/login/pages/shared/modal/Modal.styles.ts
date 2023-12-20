import styled from "styled-components";
import { Modal as AntModal } from "antd";

export const Modal = styled(AntModal)``;
interface ModalSizes {
  small: string;
  medium: string;
  large: string;
}

export const modalSizes: ModalSizes = {
  small: "400px",
  medium: "600px",
  large: "800px",
};
