/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect } from 'react';
import * as todoServise from './api/todos';
import { Todo } from './types/Todo';
import { Status } from './types/Status';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoList } from './components/TodoList';

function getPrepearedTodos(
  todos: Todo[],
  {
    status,
  }: {
    status: Status;
  },
): Todo[] {
  let preparedTodos = [...todos];

  if (status) {
    switch (status) {
      case Status.Active:
        preparedTodos = preparedTodos.filter(todo => !todo.completed);
        break;
      case Status.Completed:
        preparedTodos = preparedTodos.filter(todo => todo.completed);
        break;
    }
  }

  return preparedTodos;
}

export const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [loadingTodoId, setLoadingTodoId] = useState<number | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState<Status>(Status.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    setErrorMessage('');

    todoServise
      .getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'))
      .finally(() => setLoading(false));
  }, []);

  const visibleTodos = getPrepearedTodos(todos, { status });
  const activeTodos = getPrepearedTodos(todos, {
    status: Status.Active,
  });
  const complitedTodos = getPrepearedTodos(todos, {
    status: Status.Completed,
  });

  const addTodo = ({ userId, title, completed }: Todo) => {
    setErrorMessage('');

    return todoServise
      .addTodo({ title, userId, completed })
      .then(newTodo => setTodos(currentTodos => [...currentTodos, newTodo]))
      .catch(error => {
        setErrorMessage('Unable to add a todo');
        throw error;
      });
  };

  const deleteTodo = (todoId: number) => {
    setLoadingTodoId(todoId);

    todoServise
      .deleteTodo(todoId)
      .then(() =>
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        ),
      )
      .catch(error => {
        setErrorMessage('Unable to delete a todo');
        throw error;
      })
      .finally(() => setLoadingTodoId(null));
  };

  const deleteCompletedTodos = () => {
    complitedTodos.map(todo => deleteTodo(todo.id));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          key={todos.length}
          onSubmit={addTodo}
          setErrorMessage={setErrorMessage}
          onTempTodo={setTempTodo}
          tempTodo={tempTodo}
        />

        {loading && 'Loading...'}

        {!loading && (
          <TodoList
            visibleTodos={visibleTodos}
            onDelete={deleteTodo}
            tempTodo={tempTodo}
            loadingTodoId={loadingTodoId}
          />
        )}

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Footer
            activeCount={activeTodos.length}
            complitedCount={complitedTodos.length}
            status={status}
            setStatus={setStatus}
            deleteCompletedTodos={deleteCompletedTodos}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
