import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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

    const tab = await this.tabRepository.findOne({
      relations: ['questions'],
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

    const tab = await this.tabRepository.findOne({
      relations: ['tags'],
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
