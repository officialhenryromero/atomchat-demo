import { Component, OnInit } from '@angular/core';
import { TaskDto } from '../../entities/task.entity';
import { ServerService } from '../../../shared/services/server.service';
import { TaskStatusDto } from '../../entities/task-status.entity';
import { FadeInAnimation } from '../../../shared/animations/animations';
import { Router } from '@angular/router';

@Component({
    selector: 'app-list-tasks',
    templateUrl: './list-tasks.component.html',
    styleUrl: './list-tasks.component.scss',
    animations: [FadeInAnimation('300ms')]
})
export class ListTasksComponent implements OnInit {
    public tasks: TaskDto[] = [];
    public statuses: TaskStatusDto[] = [];
    public ready: boolean = false;
    public loading: boolean = false;

    constructor(private server: ServerService,
        private router: Router) { }

    public async ngOnInit(): Promise<void> {
        await Promise.all([
            this.getTaskStatuses(),
            this.getTasks()
        ]).then(() => this.ready = true);
    }

    private async getTasks(): Promise<void> {
        try {
            this.loading = true;
            this.tasks = await this.server.getTasks();
            console.log(this.tasks);
        } catch (ex: any) {
            console.error(ex);
        } finally {
            this.loading = false;
        }
    }

    private async getTaskStatuses(): Promise<void> {
        try {
            this.statuses = await this.server.getTaskStatuses();
            console.log(this.statuses);
        } catch (ex: any) {
            console.error(ex);
        }
    }

    public getStatusById(id: string): TaskStatusDto {
        return this.statuses.find(status => status.id === id) || {
            id: '',
            name: 'unknown',
            description: 'Unknown'
        };
    }

    public createTask(): void {
        this.router.navigate(['/tasks', 'create']);
    }

    public editTask(id: string): void {
        this.router.navigate(['/tasks', id]);
    }

    public async deleteTask(id: string): Promise<void> {
        try {
            this.loading = true;

            await this.server.deleteTask(id);
            await this.getTasks();
        } catch (ex: any) {
            console.error(ex);
        } finally {
            this.loading = false;
        }
    }
}