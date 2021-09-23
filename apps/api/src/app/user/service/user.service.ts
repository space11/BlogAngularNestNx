import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { catchError, from, map, Observable, of, switchMap, throwError } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';
import { UserRole } from '../models/user-role.enum';
import { UserEntity } from '../models/user.entity';
import { User } from '../models/user.interface';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  /**
   *
   */
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    private authService: AuthService
  ) {
  }

  create(user: User): Observable<User> {
    return this.authService.hashPassword(user.password).pipe(
      switchMap(
        (passwordHash: string) => {
          const newUser = new UserEntity();
          newUser.email = user.email;
          newUser.username = user.username;
          newUser.name = user.name;
          newUser.role = UserRole.USER;
          newUser.password = passwordHash;

          return from(this.userRepository.save(newUser))
            .pipe(
              map(removePasswordFromUser),
              catchError(err => throwError(() => err))
            );
        }));
  }
  // TODO: Implement User to UserDTO mapper
  findOne(id: string): Observable<User> {
    return from(this.userRepository.findOne({ id })).pipe(
      map(removePasswordFromUser)
    );
  }

  findAll(): Observable<User[]> {
    return from(this.userRepository.find()).pipe(
      map((users: User[]) => {
        const usersNoPassword = users.map(removePasswordFromUser);
        return usersNoPassword;
      })
    );
  }

  paginate(options: IPaginationOptions): Observable<Pagination<User>> {
    return from(paginate<User>(this.userRepository, options)).pipe(
      map((usersPageable: Pagination<User>) => {
        usersPageable.items.forEach(v => delete v.password);
        return usersPageable;
      })
    );
  }

  deleteOne(id: string): Observable<any> {
    return from(this.userRepository.delete(id));
  }

  updateOne(id: string, user: User): Observable<any> {
    delete user.email;
    delete user.password;
    delete user.role;
    return from(this.userRepository.update(id, user));
  }

  login(user: User): Observable<string> {
    return this.validateUser(user.email, user.password).pipe(
      switchMap((user: User): Observable<string> => {
        if (user) {
          return this.authService.generateJWT(user).pipe(
            map((jwt: string) => jwt)
          );
        }
        return of('Wrong Credentials.');

      })
    );
  }

  validateUser(email: string, password: string): Observable<User> {
    return this.findByMail(email).pipe(
      switchMap((user: User) => this.authService.comparePasswords(password, user.password).pipe(
        map((match: boolean) => {
          if (match) {
            return removePasswordFromUser(user);
          }
          throw Error;
        })
      ))
    );

  }

  findByMail(email: string): Observable<User> {
    return from(this.userRepository.findOne({ email }));
  }

  updateRoleOfUser(id: string, user: User): Observable<any> {
    return from(this.userRepository.update(id, user));
  }
}


// TODO: Move this function to proper implementation of the User mapping service.
function removePasswordFromUser(user: User): User {
  const { password, ...rest } = user;
  return rest;
};