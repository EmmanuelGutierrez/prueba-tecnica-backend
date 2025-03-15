import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioController } from './usuario.controller';
import { UsuarioService } from './usuario.service';
import { DatabaseProvider } from '../../database/database.provider';
import { PerfilModule } from './perfil/perfil.module';
import { JwtModule } from '@nestjs/jwt';
import { Usuario } from './entities/usuario.entity';
import { plainToInstance } from 'class-transformer';
import { QueryDto } from './dto/query.dto';
import { validate } from 'class-validator';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { fakeDatabase } from '../../database/database.mock';
describe('UsuarioController', () => {
  let controller: UsuarioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsuarioController],
      providers: [
        UsuarioService,
        {
          provide: DatabaseProvider,
          useFactory: () => {
            return new DatabaseProvider('Usuarios', fakeDatabase);
          },
        },
      ],
      imports: [
        PerfilModule,
        JwtModule.register({
          global: true,
          secret: '123',
          signOptions: { expiresIn: '10m' },
        }),
      ],
    }).compile();

    controller = module.get<UsuarioController>(UsuarioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET - /getAll', () => {
    it('deberia devolver un array de usuarios', () => {
      const res = controller.findAll({});
      expect(res).toBeDefined();
      expect(res.length).toBeGreaterThanOrEqual(1);
    });

    it('deberia devolver un array filtrado por nombre', async () => {
      const data = { nombre: 'Emmanuel' };
      const queryData = plainToInstance(QueryDto, data);
      const errors = await validate(queryData);
      expect(errors.length).toEqual(0);
      const res = controller.findAll(data) as Usuario[];
      expect(res.length).toBeGreaterThanOrEqual(1);
      expect(res[0].nombre).toEqual(data.nombre);
    });

    it('deberia devolver un error por pasar datos que no cumplen con el dto', async () => {
      const data = { nombre: 1 };
      const queryData = plainToInstance(QueryDto, data);
      const errors = await validate(queryData);
      expect(errors.length).not.toEqual(0);
    });
  });

  describe('POST - /create', () => {
    it('deberia crear un usuario ', async () => {
      const data: CreateUsuarioDto = {
        nombre: 'Test',
        edad: 21,
        correo_electronico: 'test@test.com',
        password: '123',
        perfil: {
          codigo: 'TEST',
          nombre_perfil: 'PERFIL TEST',
        },
      };
      const bodyData = plainToInstance(CreateUsuarioDto, data);
      const errors = await validate(bodyData);
      expect(errors.length).toEqual(0);
      const res = controller.create(data);
      expect(res).toBeDefined();
    });

    it('deberia devolver un error por no cumplir con el dto ', async () => {
      const data = {
        nombre: 'Test',
        edad: 'a',
        correo_electronico: 'test@test.com',
        perfil: {
          codigo: 'TEST',
        },
      };
      const bodyData = plainToInstance(CreateUsuarioDto, data);
      const errors = await validate(bodyData);
      const propertyPerfil = errors.some((e) => e.property === 'perfil');
      const propertyEdad = errors.some((e) => e.property === 'edad');
      const propertyPassword = errors.some((e) => e.property === 'password');
      expect(
        [propertyEdad, propertyPassword, propertyPerfil].every((p) => p),
      ).toBeTruthy(); //Verificamos que los errores sean estos los cuales sacamos o escribimos mal
      expect(errors.length).toEqual(3);
    });
  });
  describe('PATCH - /update', () => {
    it('deberia actualizar un usuario ', async () => {
      const data: UpdateUsuarioDto = {
        nombre: 'Test',
        edad: 21,
      };
      const bodyData = plainToInstance(UpdateUsuarioDto, data);
      const errors = await validate(bodyData);
      expect(errors.length).toEqual(0);
      const res = controller.update('1', data);
      expect(res).toBeDefined();
    });

    it('deberia devolver un error por no cumplir con el dto ', async () => {
      const data = {
        nombre: 'Test',
        edad: '21',
      };
      const bodyData = plainToInstance(UpdateUsuarioDto, data);
      const errors = await validate(bodyData);
      expect(errors.length).toEqual(1);
    });
  });
});
