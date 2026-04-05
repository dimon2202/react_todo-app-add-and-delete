import classNames from 'classnames';
import { useEffect } from 'react';

type Props = {
  errorMessage: string;
  setErrorMessage: (v: string) => void;
};

export const ErrorNotification = ({ errorMessage, setErrorMessage }: Props) => {
  useEffect(() => {
    const id = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => {
      clearTimeout(id);
    };
  }, []);

  return (
    <div
      data-cy="ErrorNotification"
      className={classNames([
        'notification',
        'is-danger',
        'is-light',
        ' has-text-weight-normal',
        {
          hidden: !errorMessage,
        },
      ])}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => setErrorMessage('')}
      />
      {errorMessage}
    </div>
  );
};
