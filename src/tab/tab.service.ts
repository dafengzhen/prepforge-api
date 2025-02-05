import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { TCurrentUser } from '../auth/current-user.decorator';
import { AUTHENTICATION_REQUIRED_MESSAGE } from '../constants';
import { CreateTabDto } from './dto/create-tab.dto';
import { UpdateCustomConfigTabDto } from './dto/update-custom-config-tab.dto';
import { UpdateTabDto } from './dto/update-tab.dto';
import { CustomConfig } from './entities/custom-config';
import { Tab } from './entities/tab.entity';

/**
 * Service for handling operations related to Tabs.
 *
 * This service provides methods for creating, retrieving, and updating Tabs, including their custom configurations.
 * Each method ensures that only authenticated users can perform actions on their own Tabs.
 *
 * @author dafengzhen
 */
@Injectable()
export class TabService {
  constructor(
    @InjectRepository(Tab)
    private readonly tabRepository: Repository<Tab>,
    private readonly entityManager: EntityManager,
  ) {}

  /**
   * Creates new Tabs based on the provided DTO and associates them with the current user.
   *
   * Validates the input data and creates one or more Tabs for the authenticated user.
   * Throws UnauthorizedException if no user is authenticated.
   *
   * @param createTabDto - Data transfer object containing information about the new Tabs.
   * @param currentUser - The currently authenticated user.
   */
  async create(createTabDto: CreateTabDto, currentUser: TCurrentUser): Promise<void> {
    if (!currentUser) {
      throw new UnauthorizedException(AUTHENTICATION_REQUIRED_MESSAGE);
    }

    const { name, names = [] } = createTabDto;
    const allNames = (typeof name === 'string' ? [name] : [])
      .concat(names)
      .map((item) => item.trim())
      .filter(Boolean);

    if (allNames.length === 0) {
      return;
    }

    const tabs = allNames.map((name) => {
      const tab = new Tab();
      tab.name = name;
      tab.user = currentUser;
      return tab;
    });

    await this.tabRepository.save(tabs);
  }

  /**
   * Retrieves all Tabs associated with the authenticated user.
   *
   * Returns a list of Tabs sorted by sort order and then by ID in descending order.
   * Throws UnauthorizedException if no user is authenticated.
   *
   * @param currentUser - The currently authenticated user.
   * @returns A promise resolving to an array of Tabs.
   */
  async findAll(currentUser: TCurrentUser): Promise<Tab[]> {
    if (!currentUser) {
      throw new UnauthorizedException(AUTHENTICATION_REQUIRED_MESSAGE);
    }

    return this.tabRepository
      .createQueryBuilder('tab')
      .where('tab.user = :userId', { userId: currentUser.id })
      .addOrderBy('tab.sort', 'DESC')
      .addOrderBy('tab.id', 'DESC')
      .getMany();
  }

  /**
   * Finds a specific Tab by ID for the authenticated user.
   *
   * Throws NotFoundException if the Tab does not exist or UnauthorizedException if no user is authenticated.
   *
   * @param id - The ID of the Tab to find.
   * @param currentUser - The currently authenticated user.
   * @returns A promise resolving to the found Tab.
   */
  async findOne(id: number, currentUser: TCurrentUser): Promise<Tab> {
    if (!currentUser) {
      throw new UnauthorizedException(AUTHENTICATION_REQUIRED_MESSAGE);
    }

    const tab = await this.tabRepository.findOne({
      where: {
        id,
        user: {
          id: currentUser.id,
        },
      },
    });

    if (!tab) {
      throw new NotFoundException('Tab not found');
    }

    return tab;
  }

  /**
   * Finds a specific Tab by ID including associated questions for the authenticated user.
   *
   * This method ensures that only authenticated users can access their own Tabs. It loads the questions associated with the specified Tab.
   * Throws UnauthorizedException if no user is authenticated or NotFoundException if the Tab does not exist.
   *
   * @param id - The ID of the Tab to find.
   * @param currentUser - The currently authenticated user.
   * @returns A promise resolving to the found Tab object, which includes its associated questions.
   */
  async findQuestionsById(id: number, currentUser: TCurrentUser): Promise<Tab> {
    if (!currentUser) {
      throw new UnauthorizedException(AUTHENTICATION_REQUIRED_MESSAGE);
    }

    const tab = await this.tabRepository
      .createQueryBuilder('tab')
      .leftJoinAndSelect('tab.questions', 'questions')
      .where('tab.id = :id', { id })
      .andWhere('tab.user = :userId', { userId: currentUser.id })
      .orderBy('questions.sort', 'DESC')
      .addOrderBy('questions.id', 'DESC')
      .getOne();

    if (!tab) {
      throw new NotFoundException('Tab not found');
    }

    return tab;
  }

  /**
   * Finds a specific Tab by ID including associated tags for the authenticated user.
   *
   * Throws NotFoundException if the specified Tab is not found or UnauthorizedException if no user is authenticated.
   * This method loads the tags associated with the Tab.
   *
   * @param id - The ID of the Tab to find.
   * @param currentUser - The currently authenticated user.
   * @returns A promise resolving to the found Tab object.
   */
  async findTagsById(id: number, currentUser: TCurrentUser): Promise<Tab> {
    if (!currentUser) {
      throw new UnauthorizedException(AUTHENTICATION_REQUIRED_MESSAGE);
    }

    const tab = await this.tabRepository
      .createQueryBuilder('tab')
      .leftJoinAndSelect('tab.tags', 'tags')
      .where('tab.id = :id', { id })
      .andWhere('tab.user = :userId', { userId: currentUser.id })
      .orderBy('tags.sort', 'DESC')
      .addOrderBy('tags.id', 'DESC')
      .getOne();

    if (!tab) {
      throw new NotFoundException('Tab not found');
    }

    return tab;
  }

  /**
   * Removes a tab entity associated with the given ID and the current user.
   *
   * This function performs the following steps:
   * 1. Checks if the current user is authenticated. If not, throws an UnauthorizedException.
   * 2. Initiates a transaction to ensure atomicity of the operation.
   * 3. Finds the tab entity associated with the provided ID and the current user.
   * 4. If the tab exists, removes it from the database.
   *
   * @param id - The ID of the tab to be removed.
   * @param currentUser - The currently authenticated user.
   * @throws {UnauthorizedException} - If the current user is not authenticated.
   * @returns {Promise<void>} - A promise that resolves when the operation is complete.
   */
  async remove(id: number, currentUser: TCurrentUser): Promise<void> {
    if (!currentUser) {
      throw new UnauthorizedException(AUTHENTICATION_REQUIRED_MESSAGE);
    }

    await this.entityManager.transaction(async (manager) => {
      const tab = await manager.findOne(Tab, {
        where: {
          id,
          user: {
            id: currentUser.id,
          },
        },
      });

      if (tab) {
        await manager.remove(Tab, tab);
      }
    });
  }

  /**
   * Updates an existing Tab identified by ID with new data provided in the DTO.
   *
   * Throws UnauthorizedException if no user is authenticated or NotFoundException if the Tab does not exist.
   * Updates the name and/or sort order of the Tab based on the provided DTO.
   *
   * @param id - The ID of the Tab to update.
   * @param updateTabDto - Data transfer object containing updated information about the Tab.
   * @param currentUser - The currently authenticated user.
   */
  async update(id: number, updateTabDto: UpdateTabDto, currentUser: TCurrentUser): Promise<void> {
    if (!currentUser) {
      throw new UnauthorizedException(AUTHENTICATION_REQUIRED_MESSAGE);
    }

    const tab = await this.tabRepository.findOne({
      where: {
        id,
        user: {
          id: currentUser.id,
        },
      },
    });

    if (!tab) {
      throw new NotFoundException('Tab not found');
    }

    const { name, sort } = updateTabDto;
    if (name) {
      tab.name = name.trim();
    }

    if (typeof sort === 'number') {
      tab.sort = sort;
    }

    await this.tabRepository.save(tab);
  }

  /**
   * Updates the custom configuration of a Tab identified by ID.
   *
   * Throws UnauthorizedException if no user is authenticated. If the Tab does not exist, it simply returns without making changes.
   * Merges the existing custom configuration with the new values provided in the DTO and updates the Tab.
   *
   * @param id - The ID of the Tab whose custom configuration needs to be updated.
   * @param updateCustomConfigTabDto - Data transfer object containing updated custom configuration details.
   * @param currentUser - The currently authenticated user.
   */
  async updateCustomConfig(
    id: number,
    updateCustomConfigTabDto: UpdateCustomConfigTabDto,
    currentUser: TCurrentUser,
  ): Promise<void> {
    if (!currentUser) {
      throw new UnauthorizedException(AUTHENTICATION_REQUIRED_MESSAGE);
    }

    const user = await this.tabRepository.findOne({ where: { id, user: { id: currentUser.id } } });
    if (!user) {
      return;
    }

    const updatedCustomConfig: CustomConfig = {
      ...user.customConfig,
      ...updateCustomConfigTabDto,
      type: 'tab',
    };

    await this.tabRepository.update(id, { customConfig: updatedCustomConfig });
  }
}
