create table if not exists query_result_cache
(
    id         int auto_increment primary key,
    identifier varchar(255) null,
    time       bigint       not null,
    duration   int          not null,
    query      text         not null,
    result     text         not null
);

create table if not exists user
(
    create_date   datetime(6) default CURRENT_TIMESTAMP(6) not null,
    delete_date   datetime(6)                              null,
    id            int auto_increment primary key,
    update_date   datetime(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    version       int                                      not null,
    custom_config json                                     not null,
    password      varchar(255)                             not null,
    username      varchar(255)                             not null,
    constraint IDX_78a916df40e02a9deb1c4b75ed unique (username)
);

create table if not exists tab
(
    create_date   datetime(6) default CURRENT_TIMESTAMP(6) not null,
    delete_date   datetime(6)                              null,
    id            int auto_increment primary key,
    update_date   datetime(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    version       int                                      not null,
    custom_config json                                     not null,
    name          varchar(255)                             not null,
    sort          int         default 0                    not null,
    user_id       int                                      null,
    constraint FK_8cc16a2635ad9cf1794384ac3ca foreign key (user_id) references user (id) on delete cascade
);

create table if not exists tag
(
    create_date   datetime(6) default CURRENT_TIMESTAMP(6) not null,
    delete_date   datetime(6)                              null,
    id            int auto_increment primary key,
    update_date   datetime(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    version       int                                      not null,
    custom_config json                                     not null,
    name          varchar(255)                             not null,
    sort          int         default 0                    not null,
    tab_id        int                                      null,
    user_id       int                                      null,
    constraint FK_c34ed3c5a24047dbecf1b29254a foreign key (tab_id) references tab (id) on delete cascade,
    constraint FK_d0be05b78e89aff4791e6189f77 foreign key (user_id) references user (id) on delete cascade
);

create table if not exists question
(
    create_date   datetime(6) default CURRENT_TIMESTAMP(6) not null,
    delete_date   datetime(6)                              null,
    id            int auto_increment primary key,
    update_date   datetime(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    version       int                                      not null,
    answer        text                                     not null,
    custom_config json                                     not null,
    question      text                                     not null,
    sort          int         default 0                    not null,
    tab_id        int                                      null,
    tag_id        int                                      null,
    user_id       int                                      null,
    constraint FK_0d8cbbfa2442b3bcc54b81fcb8b foreign key (tag_id) references tag (id) on delete cascade,
    constraint FK_82c53e1db067ff3d6ef17dfd5c4 foreign key (user_id) references user (id) on delete cascade,
    constraint FK_e972e175c13dd66d82c4602aa5c foreign key (tab_id) references tab (id) on delete cascade
);

create fulltext index IDX_7dd1a945ab428f2a3392c2d453 on question (question) with parser ngram;

create fulltext index IDX_dbf18774d1583f8d6eb7bd9172 on question (answer) with parser ngram;
