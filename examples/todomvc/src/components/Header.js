import React, { Component, PropTypes } from 'react';
import { createObserver } from 'dop';
import state from '../state';
import { changeTextNewTodo, addTodo, completeAll } from '../actions';


export default class Header extends Component {
    componentWillMount() {
        const observer = createObserver(mutations => {
            this.forceUpdate();
        });
        observer.observe(state.todos, 'length');
        observer.observe(state, 'newTodoText');
        observer.observe(state, 'areAllItemsCompleted');
    }

    shouldComponentUpdate() {
        return false;
    }

    onChangeText(e) {
        changeTextNewTodo(e.target.value.trim());
    }

    onSave(e) {
        if (e.which === 13)
            addTodo(e.target.value.trim());
    }

    render() {
        return (
            <HeaderTemplate
                value={state.newTodoText}
                todosLength={state.todos.length}
                onChangeText={this.onChangeText}
                onSave={this.onSave}
                onCompleteAll={completeAll}
                areAllItemsCompleted={state.areAllItemsCompleted}
            />
        );
    }
}

function HeaderTemplate({ value, todosLength, onChangeText, onSave, onCompleteAll, areAllItemsCompleted}) {
    let toggle;
    if (todosLength > 0)
        toggle = <input
            className="toggle-al"
            type="checkbox"
            checked={areAllItemsCompleted}
            onChange={onCompleteAll}
        />
    return (
        <header className="header">
            <h1>todos</h1>
            <input
                className="new-todo"
                type="text"
                placeholder="What needs to be done?"
                autoFocus="true"
                value={value}
                onChange={onChangeText}
                onKeyDown={onSave}
            />
            {toggle}
        </header>
    );
}
