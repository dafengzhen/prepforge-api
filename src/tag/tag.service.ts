import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { TCurrentUser } from '../auth/current-user.decorator';
import { AUTHENTICATION_REQUIRED_MESSAGE } from '../constants';
import { Tab } from '../tab/entities/tab.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateCustomConfigTagDto } from './dto/update-custom-config-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { CustomConfig } from './entities/custom-config';
import { Tag } from './entities/tag.entity';

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
    private readonly entityManager: EntityManager,
  ) {}

  /**
   * Creates new Tags based on the provided DTO and associates them with the current user and optionally a Tab.
   *
   * Validates the input data and creates one or more Tags for the authenticated user. Optionally links each Tag to a specified Tab.
   * Throws UnauthorizedException if no user is authenticated.
   *
   * @param createTagDto - Data transfer object containing information about the new Tags.
   * @param currentUser - The currently authenticated user.
   */
  async create(createTagDto: CreateTagDto, currentUser: TCurrentUser): Promise<void> {
    if (!currentUser) {
      throw new UnauthorizedException(AUTHENTICATION_REQUIRED_MESSAGE);
    }

    const { name, names = [], tabId } = createTagDto;
    const allNames = (typeof name === 'string' ? [name] : [])
      .concat(names)
      .map((item) => item.trim())
      .filter(Boolean);

    if (allNames.length === 0) {
      return;
    }

    const tab = tabId ? await this.tabRepository.findOne({ where: { id: tabId, user: { id: currentUser.id } } }) : null;

    const tags = allNames.map((tagName) => {
      const tag = new Tag();
      tag.name = tagName;
      tag.user = currentUser;
      if (tab) {
        tag.tab = tab;
      }
      return tag;
    });

    await this.tagRepository.save(tags);
  }

  /**
   * Retrieves all Tags associated with the authenticated user.
   *
   * Returns a list of Tags sorted by sort order and then by ID in descending order. Also includes associated Tabs.
   * Throws UnauthorizedException if no user is authenticated.
   *
   * @param currentUser - The currently authenticated user.
   * @returns A promise resolving to an array of Tags.
   */
  async findAll(currentUser: TCurrentUser): Promise<Tag[]> {
    if (!currentUser) {
      throw new UnauthorizedException(AUTHENTICATION_REQUIRED_MESSAGE);
    }

    return this.tagRepository
      .createQueryBuilder('tag')
      .leftJoinAndSelect('tag.tab', 'tab')
      .where('tag.user = :userId', { userId: currentUser.id })
      .addOrderBy('tag.sort', 'DESC')
      .addOrderBy('tag.id', 'DESC')
      .getMany();
  }

  /**
   * Finds a specific Tag by ID for the authenticated user.
   *
   * Includes the associated Tab in the result. Throws NotFoundException if the Tag does not exist or UnauthorizedException if no user is authenticated.
   *
   * @param id - The ID of the Tag to find.
   * @param currentUser - The currently authenticated user.
   * @returns A promise resolving to the found Tag.
   */
  async findOne(id: number, currentUser: TCurrentUser): Promise<Tag> {
    if (!currentUser) {
      throw new UnauthorizedException(AUTHENTICATION_REQUIRED_MESSAGE);
    }

    const tag = await this.tagRepository.findOne({
      relations: ['tab'],
      where: {
        id,
        user: {
          id: currentUser.id,
        },
      },
    });

    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    return tag;
  }

  /**
   * Finds a specific Tag by ID including associated questions for the authenticated user.
   *
   * Includes the associated questions in the result. Throws NotFoundException if the Tag does not exist or UnauthorizedException if no user is authenticated.
   *
   * @param id - The ID of the Tag to find.
   * @param currentUser - The currently authenticated user.
   * @returns A promise resolving to the found Tag object, which includes its associated questions.
   */
  async findQuestionsById(id: number, currentUser: TCurrentUser): Promise<Tag> {
    if (!currentUser) {
      throw new UnauthorizedException(AUTHENTICATION_REQUIRED_MESSAGE);
    }

    const tag = await this.tagRepository.findOne({
      order: {
        questions: {
          id: 'DESC',
          sort: 'DESC',
        },
      },
      relations: ['questions'],
      where: {
        id,
        user: {
          id: currentUser.id,
        },
      },
    });

    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    return tag;
  }

  /**
   * Removes a tag entity associated with the given ID and the current user.
   *
   * This function performs the following steps:
   * 1. Checks if the current user is authenticated. If not, throws an UnauthorizedException.
   * 2. Initiates a transaction to ensure atomicity of the operation.
   * 3. Finds the tag entity associated with the provided ID and the current user.
   * 4. If the tag exists, removes it from the database.
   *
   * @param id - The ID of the tag to be removed.
   * @param currentUser - The currently authenticated user.
   * @throws {UnauthorizedException} - If the current user is not authenticated.
   * @returns {Promise<void>} - A promise that resolves when the operation is complete.
   */
  async remove(id: number, currentUser: TCurrentUser): Promise<void> {
    if (!currentUser) {
      throw new UnauthorizedException(AUTHENTICATION_REQUIRED_MESSAGE);
    }

    await this.entityManager.transaction(async (manager) => {
      const tag = await manager.findOne(Tag, {
        where: {
          id,
          user: {
            id: currentUser.id,
          },
        },
      });

      if (tag) {
        await manager.remove(Tag, tag);
      }
    });
  }

  /**
   * Updates an existing Tag identified by ID with new data provided in the DTO.
   *
   * Throws UnauthorizedException if no user is authenticated or NotFoundException if the Tag does not exist.
   * Updates the name and/or sort order of the Tag based on the provided DTO.
   *
   * @param id - The ID of the Tag to update.
   * @param updateTagDto - Data transfer object containing updated information about the Tag.
   * @param currentUser - The currently authenticated user.
   */
  async update(id: number, updateTagDto: UpdateTagDto, currentUser: TCurrentUser): Promise<void> {
    if (!currentUser) {
      throw new UnauthorizedException(AUTHENTICATION_REQUIRED_MESSAGE);
    }

    const tag = await this.tagRepository.findOne({
      where: {
        id,
        user: {
          id: currentUser.id,
        },
      },
    });

    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    const { name, sort } = updateTagDto;
    if (name) {
      tag.name = name.trim();
    }

    if (typeof sort === 'number') {
      tag.sort = sort;
    }

    await this.tagRepository.save(tag);
  }

  /**
   * Updates the custom configuration of a Tag identified by ID.
   *
   * Throws UnauthorizedException if no user is authenticated. If the Tag does not exist, it simply returns without making changes.
   * Merges the existing custom configuration with the new values provided in the DTO and updates the Tag.
   *
   * @param id - The ID of the Tag whose custom configuration needs to be updated.
   * @param updateCustomConfigTagDto - Data transfer object containing updated custom configuration details.
   * @param currentUser - The currently authenticated user.
   */
  async updateCustomConfig(
    id: number,
    updateCustomConfigTagDto: UpdateCustomConfigTagDto,
    currentUser: TCurrentUser,
  ): Promise<void> {
    if (!currentUser) {
      throw new UnauthorizedException(AUTHENTICATION_REQUIRED_MESSAGE);
    }

    const user = await this.tagRepository.findOne({ where: { id, user: { id: currentUser.id } } });
    if (!user) {
      return;
    }

    const updatedCustomConfig: CustomConfig = {
      ...user.customConfig,
      ...updateCustomConfigTagDto,
      type: 'tag',
    };

    await this.tagRepository.update(id, { customConfig: updatedCustomConfig });
  }
}
