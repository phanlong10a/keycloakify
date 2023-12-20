import styled, { css } from "styled-components";
import { Form } from "antd";

export const BREAKPOINTS = {
  xs: 360,
  sm: 568,
  md: 768,
  lg: 992,
  xl: 1280,
  xxl: 1920,
} as const;

const getMedia = <T extends number>(breakpoint: T): `(min-width: ${T}px)` =>
  `(min-width: ${breakpoint}px)`;
export const media = {
  xs: getMedia(BREAKPOINTS.xs),
  sm: getMedia(BREAKPOINTS.sm),
  md: getMedia(BREAKPOINTS.md),
  lg: getMedia(BREAKPOINTS.lg),
  xl: getMedia(BREAKPOINTS.xl),
  xxl: getMedia(BREAKPOINTS.xxl),
};

interface FormItemProps {
  $isSuccess?: boolean;
  $successText?: string;
}

export const BaseFormItem = styled(Form.Item)<FormItemProps>`
  .ant-form-item-label > label {
    color: #01509a;
  }

  .ant-input-group-addon:first-of-type {
    font-weight: 600;
    width: 5rem;

    color: #01509a;

    .anticon,
    svg {
      font-size: 20px;
    }

    @media only screen and ${media.md} {
      width: 5.5rem;
      font-size: 18px;
    }

    @media only screen and ${media.xl} {
      font-size: 24px;
    }
  }

  .ant-input-suffix .ant-btn {
    padding: 0;
    width: unset;
    height: unset;
    line-height: 1;
  }

  .ant-form-item-explain-error {
    display: flex;
    margin: 8px 0;
    line-height: 1;

    &:before {
      content: "X";
      display: inline-flex;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      margin: 0 4px;
      color: #ffffff;
      background: #ff5252;
      border-radius: 50%;
      width: 16px;
      height: 16px;
      font-size: 8px;
    }

    &:not(:first-of-type) {
      display: none;
    }
  }

  ${(props) =>
    props.$isSuccess &&
    css`
      .ant-input {
        &,
        &:hover {
          border-color: #30af5b;
        }
      }

      .ant-form-item-control-input {
        display: block;

        &::after {
          content: "✓ ${props.$successText}";
          color: #30af5b;
        }
      }
    `}

  &.ant-form-item-has-feedback .ant-form-item-children-icon {
    display: none;
  }

  .ant-picker-suffix {
    font-size: 16px;
  }

  .ant-select-arrow {
    font-size: 16px;
    width: unset;
    height: unset;
    top: 50%;
  }

  &.ant-form-item-has-error .ant-input,
  &.ant-form-item-has-error .ant-input-affix-wrapper,
  &.ant-form-item-has-error .ant-input:hover,
  &.ant-form-item-has-error .ant-input-affix-wrapper:hover {
    border-color: #ff5252;
  }

  &.ant-form-item-has-success.ant-form-item-has-feedback .ant-input,
  &.ant-form-item-has-success.ant-form-item-has-feedback
    .ant-input-affix-wrapper,
  &.ant-form-item-has-success.ant-form-item-has-feedback .ant-input:hover,
  &.ant-form-item-has-success.ant-form-item-has-feedback
    .ant-input-affix-wrapper:hover {
    border-color: #30af5b;
  }
`;

export const ForgotPasswordText = styled.span`
  color: #9a9b9f;
  font-size: 14px;
  text-decoration: underline;
`;

export const ActionsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
`;

export const WrapGoogleAuthencator = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  > img {
    width: 200px;
  }
  > input {
    margin-top: 30px;
    margin-bottom: 30px;
  }
  > .wrap-label {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

export const WrapGoogleAuthencatorSuccess = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  > .text-content {
    margin-top: 64px;
    margin-bottom: 48px;
    color: #4284f5;
  }
`;
