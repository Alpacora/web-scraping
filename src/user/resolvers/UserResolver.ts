import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Tracker, TrackInfo, User } from "../domain/User";
import { UserService } from "../service";
import { UserRepository } from "../repository/UserRepository";
import { v4 } from "uuid";
import bcrypt from 'bcrypt';
import { ScrapPackageTrackInfo } from "../../utils/ScrapPackageTrackInfo";

@Resolver()
export class UserResolver {

  constructor(
    private userService = new UserService(new UserRepository(), new ScrapPackageTrackInfo())
  ) { }

  @Query(() => [User])
  async findAll() {
    const users = await this.userService.findAll();
    return users;
  }

  @Query(() => User)
  async findById(
    @Arg('_id') _id: string
  ) {
    const user = await this.userService.findById(_id);
    return user;
  }

  @Query(() => Tracker)
  async searchPackageByCode(
    @Arg('code') code: string
  ) {
    const trackInfo = await this.userService.searchPackageByCode(code);

    return trackInfo;
  }

  @Mutation(() => User)
  async save(
    @Arg('name') name: string,
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Arg('active') active: boolean,
  ) {

    const user: User = {
      _id: v4(),
      name,
      email,
      password: bcrypt.hashSync(password, 8),
      active,
      trackers: [],
      createdAt: new Date()
    }

    await this.userService.save(user);

    return user;
  }

  @Mutation(() => User)
  async update(
    @Arg('_id') _id: string,
    @Arg('name', { nullable: true }) name: string,
    @Arg('email', { nullable: true }) email: string,
    @Arg('password', { nullable: true }) password: string,
    @Arg('active', { nullable: true }) active: boolean,
  ) {

    const userUpdated = await this.userService.update({
      _id: _id,
      name: name ? name as unknown as string : '',
      email: email ? email as unknown as string : '',
      password: password ? password as unknown as string : '',
      active
    });

    return userUpdated
  }
}
