import { Component, OnInit } from '@angular/core';
import { Todo } from '../../models/todo';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';

type FilterType = 'all' | 'active' | 'completed';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.css'
})
export class TodoListComponent implements OnInit {
  todos: Todo[] = [];
  newTodoTitle: string = '';
  currentFilter: FilterType = 'all';
  editingTodo: Todo | null = null;
  editingText: string = '';

  ngOnInit() {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      this.todos = JSON.parse(savedTodos);
    }
  }

  private saveTodos() {
    localStorage.setItem('todos', JSON.stringify(this.todos));
  }

  addTodo() {
    if (this.newTodoTitle.trim()) {
      const newTodo: Todo = {
        id: Date.now(),
        title: this.newTodoTitle.trim(),
        completed: false,
        createdAt: new Date().toISOString()
      };
      this.todos.unshift(newTodo);
      this.newTodoTitle = '';
      this.saveTodos();
    }
  }

  startEditing(todo: Todo) {
    this.editingTodo = todo;
    this.editingText = todo.title;
  }

  cancelEditing() {
    this.editingTodo = null;
    this.editingText = '';
  }

  saveEdit() {
    if (this.editingTodo && this.editingText.trim()) {
      this.editingTodo.title = this.editingText.trim();
      this.saveTodos();
      this.cancelEditing();
    }
  }

  toggleTodo(todo: Todo) {
    todo.completed = !todo.completed;
    this.saveTodos();
  }

  deleteTodo(id: number) {
    this.todos = this.todos.filter(todo => todo.id !== id);
    this.saveTodos();
  }

  clearCompleted() {
    this.todos = this.todos.filter(todo => !todo.completed);
    this.saveTodos();
  }

  getCompletedCount(): number {
    return this.todos.filter(todo => todo.completed).length;
  }

  getPendingCount(): number {
    return this.todos.filter(todo => !todo.completed).length;
  }

  setFilter(filter: FilterType) {
    this.currentFilter = filter;
  }

  get filteredTodos(): Todo[] {
    switch (this.currentFilter) {
      case 'active':
        return this.todos.filter(todo => !todo.completed);
      case 'completed':
        return this.todos.filter(todo => todo.completed);
      default:
        return this.todos;
    }
  }

  getFormattedDate(date: string): string {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}