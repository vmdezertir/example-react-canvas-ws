import React, { FC, useCallback, useState } from 'react';
import { Modal, Input, ModalProps } from 'antd';
import { useUserStore } from 'store';

export interface IProps extends ModalProps {
  submitHandler: () => void;
  closeHandler?: () => void;
}

export const UserModal: FC<IProps> = ({ submitHandler, closeHandler, ...props }) => {
  const [name, setName] = useState<string>('');
  const { setUserName, isOpenModal, closeModal } = useUserStore(state => ({
    isOpenModal: state.isOpenModal,
    closeModal: state.closeModal,
    setUserName: state.setUserName,
  }));

  const onOkHandler = useCallback(() => {
    setUserName(name);
    submitHandler();
  }, [submitHandler, setUserName, name]);

  const onCancelHandler = useCallback(() => {
    closeModal();
    if (closeHandler) {
      closeHandler();
    }
  }, [closeHandler, closeModal]);

  const nameChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  return (
    <Modal
      title="Please, add your name"
      open={isOpenModal}
      onOk={onOkHandler}
      onCancel={onCancelHandler}
      okButtonProps={{ disabled: !name }}
      {...props}
    >
      <Input onChange={nameChangeHandler} placeholder="Your name" />
    </Modal>
  );
};
