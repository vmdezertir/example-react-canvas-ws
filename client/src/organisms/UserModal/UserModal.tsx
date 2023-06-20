import React, { FC, MouseEvent, useCallback } from 'react';
import { Modal, Input, ModalProps } from 'antd';
import { useUserStore } from 'store';

export interface IProps extends ModalProps {
  submitHandler: () => void;
  closeHandler?: () => void;
}

export const UserModal: FC<IProps> = ({ submitHandler, closeHandler, ...props }) => {
  const { userName, setUserName, isOpenModal, closeModal } = useUserStore(state => ({
    userName: state.userName,
    isOpenModal: state.isOpenModal,
    closeModal: state.closeModal,
    setUserName: state.setUserName,
  }));

  const onOkHandler = useCallback(
    (e: MouseEvent) => {
      submitHandler();
    },
    [submitHandler],
  );

  const onCancelHandler = useCallback(() => {
    closeModal();
    if (closeHandler) {
      closeHandler();
    }
  }, [closeHandler, closeModal]);

  const nameChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
  };

  return (
    <Modal
      title="Please, add your name"
      open={isOpenModal}
      onOk={onOkHandler}
      onCancel={onCancelHandler}
      okButtonProps={{ disabled: !userName }}
      {...props}
    >
      <Input onChange={nameChangeHandler} placeholder="Your name" />
    </Modal>
  );
};
