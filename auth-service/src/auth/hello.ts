// Folder Structure Example
// src/
// ├── user/
// │   ├── user.module.ts
// │   ├── user.controller.ts        ← REST endpoints (HTTP)
// │   ├── user.service.ts           ← Business logic
// │   ├── listeners/
// │   │   └── user-created.listener.ts   ← Kafka consumer
// │   └── dto/
// │       └── create-user.dto.ts

// ⚙️ 3️⃣ Example — REST Controller (user.controller.ts)
// import { Controller, Get, Post, Body, Param } from '@nestjs/common';
// import { UserService } from './user.service';
// import { CreateUserDto } from './dto/create-user.dto';

// @Controller('users') // <-- HTTP route base path
// export class UserController {
//   constructor(private readonly userService: UserService) {}

//   @Post()
//   async create(@Body() dto: CreateUserDto) {
//     return this.userService.createUser(dto);
//   }

//   @Get(':id')
//   async findOne(@Param('id') id: string) {
//     return this.userService.findUserById(id);
//   }
// }


// ✅ This controller responds to REST API calls such as:

// POST /users

// GET /users/:id

// ⚙️ 4️⃣ Example — Kafka Consumer / Listener (listeners/user-created.listener.ts)
// import { Controller } from '@nestjs/common';
// import { EventPattern, Payload } from '@nestjs/microservices';
// import { UserService } from '../user.service';

// @Controller()
// export class UserCreatedListener {
//   constructor(private readonly userService: UserService) {}

//   @EventPattern('user.create.requested')
//   async handleUserCreated(@Payload() message: any) {
//     console.log('📥 Received event user.create.requested:', message.value);

//     // Extract data from message
//     const { email, name, password } = message.value;

//     // Reuse business logic
//     await this.userService.createUser({ email, name, password });
//   }
// }


// ✅ This listener reacts to a Kafka topic (user.create.requested),
// triggered for example by auth-service when a new user registration request is published.

// 🧱 5️⃣ Example — Shared Business Logic (user.service.ts)
// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class UserService {
//   private users = []; // for demo only

//   async createUser(dto: any) {
//     const user = { id: Date.now(), ...dto };
//     this.users.push(user);
//     console.log('✅ User created:', user);
//     return user;
//   }

//   async findUserById(id: string) {
//     return this.users.find(u => u.id === +id);
//   }
// }


// Both the REST controller and Kafka listener reuse this service,
// so the logic (creating or fetching users) stays consistent and testable.

// 🧩 6️⃣ Module Setup (user.module.ts)
// import { Module } from '@nestjs/common';
// import { UserController } from './user.controller';
// import { UserService } from './user.service';
// import { UserCreatedListener } from './listeners/user-created.listener';

// @Module({
//   controllers: [UserController, UserCreatedListener],
//   providers: [UserService],
// })
// export class UserModule {}


// ✅ Both UserController and UserCreatedListener are registered as NestJS controllers.
// Nest will automatically:

// expose the REST controller on HTTP routes, and

// subscribe the listener to Kafka topics.

// 🚀 7️⃣ Application Bootstrap (main.ts)
// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { MicroserviceOptions, Transport } from '@nestjs/microservices';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   // Connect Kafka microservice
//   app.connectMicroservice<MicroserviceOptions>({
//     transport: Transport.KAFKA,
//     options: {
//       client: {
//         clientId: 'user-service',
//         brokers: ['localhost:9092'],
//       },
//       consumer: {
//         groupId: 'user-service-consumer',
//       },
//     },
//   });

//   await app.startAllMicroservices();
//   await app.listen(3001);
//   console.log('🚀 User Service running on port 3001');
// }
// bootstrap();

// ✅ Summary — Difference Between REST Controller and Kafka Consumer
// Aspect	REST Controller	Kafka Consumer / Listener
// Decorator	@Controller('path')	@Controller()
// Handler Decorator	@Get(), @Post()	@EventPattern('topic') or @MessagePattern('topic')
// Communication	HTTP (synchronous request/response)	Kafka (asynchronous events)
// Trigger	Client calls API	Another service emits an event
// Response	Returns JSON / status code	Usually no direct response
// Example use case	POST /users to create user	React to user.create.requested Kafka event