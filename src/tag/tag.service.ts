import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';
import { User } from '../user/entities/user.entity';
import { checkUserPermission } from '../common/tool/tool';
import { UpdateCustomizationSettingsTagDto } from './dto/update-customization-settings-tag.dto';
import { updateCustomizationSettings } from 'src/common/tool/customization-settings.tool';
import { CustomizationSettings } from './entities/customization-settings';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tab } from '../tab/entities/tab.entity';

/**
 * TagService.
 *
 * @author dafengzhen
 */
@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,

    @InjectRepository(Tab)
    private readonly tabRepository: Repository<Tab>,
  ) {}

  async create(currentUser: User, createTagDto: CreateTagDto) {
    const { name, names = [], tabId } = createTagDto;
    const allNames = [
      ...names,
      ...(typeof name === 'string' ? [name] : []),
    ].filter((item) => item !== '');

    if (allNames.length === 0) {
      return;
    }

    const tags = [];
    for (const item of allNames) {
      const tag = new Tag();
      tag.name = item;
      tag.user = currentUser;

      if (typeof tabId === 'number' && tabId !== -1) {
        const tab = await this.tabRepository.findOne({ where: { id: tabId } });
        if (tab) {
          tag.tab = tab;
        }
      }

      tags.push(tag);
    }

    await this.tagRepository.save(tags);
  }

  async findAll(currentUser: User) {
    return this.tagRepository
      .createQueryBuilder('tag')
      .leftJoinAndSelect('tag.tab', 'tab')
      .where('tag.user = :userId', { userId: currentUser.id })
      .addOrderBy('tag.sort', 'DESC')
      .addOrderBy('tag.id', 'DESC')
      .getMany();
  }

  async findOne(id: number, currentUser: User) {
    return this.tagRepository.findOneOrFail({
      where: {
        id,
        user: {
          id: currentUser.id,
        },
      },
      relations: ['tab'],
    });
  }

  async findQuestionsById(id: number, currentUser: User) {
    return this.tagRepository.findOneOrFail({
      where: {
        id,
        user: {
          id: currentUser.id,
        },
      },
      relations: ['questions'],
    });
  }

  async update(id: number, currentUser: User, updateTagDto: UpdateTagDto) {
    const tag = await this.tagRepository.findOneOrFail({
      where: {
        id,
        user: {
          id: currentUser.id,
        },
      },
    });

    const { name, sort } = updateTagDto;

    if (name === tag.name && sort === tag.sort) {
      return;
    }

    const trimmedName = name?.trim();
    if (trimmedName) {
      tag.name = trimmedName;
    }

    if (typeof sort === 'number') {
      tag.sort = sort;
    }

    await this.tagRepository.save(tag);
  }

  async updateCustomizationSettings(
    id: number,
    currentUser: User,
    updateCustomizationSettingsTagDto: UpdateCustomizationSettingsTagDto,
  ) {
    checkUserPermission(id, currentUser.id);

    const tag = await this.tagRepository.findOneByOrFail({
      id,
    });

    tag.customizationSettings = updateCustomizationSettings(
      'tag',
      tag.customizationSettings,
      updateCustomizationSettingsTagDto,
    ) as CustomizationSettings;

    await this.tagRepository.save(tag);
  }
}
