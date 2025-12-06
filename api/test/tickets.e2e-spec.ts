import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Tickets (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/tickets (GET) - unauthorized', () => {
        return request(app.getHttpServer())
            .get('/tickets')
            .expect(403); // Or 401 depeding on guard
    });

    // Note: Realistic tests need auth token mocking which is harder in E2E without login flow.
    // For now just basic connectivity check.
});
