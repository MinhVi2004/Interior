package com.example.interior.service.support;

import com.example.interior.common.entity.BaseEntity;

import java.util.Collections;
import java.util.List;

public abstract class EntityMapperSupport {

    protected List<Long> idsOf(List<? extends BaseEntity> entities) {
        if (entities == null) {
            return Collections.emptyList();
        }
        return entities.stream().map(BaseEntity::getId).toList();
    }
}