type SetterFn<TState> = (prevState: TState) => Partial<TState>;

export function createStore<TState>(initialState: TState) {
  let state = initialState;
  const listeners = new Set<() => void>(); // Set não permite itens duplicados

  function notifyListeners() {
    listeners.forEach((listener) => listener());
  }

  function setState(partialState: Partial<TState> | SetterFn<TState>) {
    const newValue =
      typeof partialState === 'function' ? partialState(state) : partialState;

    state = {
      ...state,
      ...newValue,
    };

    notifyListeners();
  }

  function subscribe(listener: () => void) {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  }

  function getState() {
    return state;
  }

  return { setState, getState, subscribe };
}

const store = createStore({ userName: 'João', active: false, counter: 1 });

store.subscribe(() => {
  console.log(store.getState());
});

store.subscribe(() => {
  console.log('Listener 2');
});

store.setState({ userName: 'Maria' });
store.setState((prevState) => ({ counter: prevState.counter + 1 }));
