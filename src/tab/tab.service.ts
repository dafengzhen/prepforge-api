import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tab } from './entities/tab.entity';
import { User } from '../user/entities/user.entity';
import { checkUserPermission } from '../common/tool/tool';
import { updateCustomizationSettings } from 'src/common/tool/customization-settings.tool';
import { UpdateCustomizationSettingsTabDto } from './dto/update-customization-settings-tab.dto';
import { CustomizationSettings } from './entities/customization-settings';
import { CreateTabDto } from './dto/create-tab.dto';
import { UpdateTabDto } from './dto/update-tab.dto';

/**
 * TabService.
 *
 * @author dafengzhen
 */
@Injectable()
export class TabService {
  constructor(
    @InjectRepository(Tab)
    private readonly tabRepository: Repository<Tab>,
  ) {}

  async create(currentUser: User, createTabDto: CreateTabDto) {
    const { name, names = [] } = createTabDto;
    const allNames = [
      ...names,
      ...(typeof name === 'string' ? [name] : []),
    ].filter((item) => item !== '');

    if (allNames.length === 0) {
      return;
    }

    const tabs = allNames.map((item) => {
      const tab = new Tab();
      tab.name = item;
      tab.user = currentUser;
      return tab;
    });

    await this.tabRepository.save(tabs);
  }

  async findAll(currentUser: User) {
    return this.tabRepository
      .createQueryBuilder('tab')
      .where('tab.user = :userId', { userId: currentUser.id })
      .addOrderBy('tab.sort', 'DESC')
      .addOrderBy('tab.id', 'DESC')
      .getMany();
  }

  async findOne(id: number, currentUser: User) {
    return this.tabRepository.findOneOrFail({
      where: {
        id,
        user: {
          id: currentUser.id,
        },
      },
    });
  }

  async findTagsById(id: number, currentUser: User) {
    return this.tabRepository.findOneOrFail({
      where: {
        id,
        user: {
          id: currentUser.id,
        },
      },
      relations: ['tags'],
    });
  }

  async update(id: number, currentUser: User, updateTabDto: UpdateTabDto) {
    const tab = await this.tabRepository.findOneOrFail({
      where: {
        id,
        user: {
          id: currentUser.id,
        },
      },
    });

    const { name, sort } = updateTabDto;

    if (name === tab.name && sort === tab.sort) {
      return;
    }

    const trimmedName = name?.trim();
    if (trimmedName) {
      tab.name = trimmedName;
    }

    if (typeof sort === 'number') {
      tab.sort = sort;
    }

    await this.tabRepository.save(tab);
  }

  async updateCustomizationSettings(
    id: number,
    currentUser: User,
    updateCustomizationSettingsTabDto: UpdateCustomizationSettingsTabDto,
  ) {
    checkUserPermission(id, currentUser.id);

    const tab = await this.tabRepository.findOneByOrFail({
      id,
    });

    tab.customizationSettings = updateCustomizationSettings(
      'tab',
      tab.customizationSettings,
      updateCustomizationSettingsTabDto,
    ) as CustomizationSettings;

    await this.tabRepository.save(tab);
  }
}
