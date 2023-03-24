package com.dsi.appDisfraces.mapper;

import com.dsi.appDisfraces.dto.ClientTableDto;
import com.dsi.appDisfraces.dto.CostumeDetailDTO;
import com.dsi.appDisfraces.dto.CostumeRequestDTO;
import com.dsi.appDisfraces.dto.CostumeTableDTO;
import com.dsi.appDisfraces.entity.ClientEntity;
import com.dsi.appDisfraces.entity.CostumeEntity;

import com.dsi.appDisfraces.enumeration.CostumeStatus;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.NoSuchElementException;
import org.springframework.stereotype.Component;

@Component
public class CostumeMapper {

  public CostumeEntity costumeDTO2Entity(CostumeRequestDTO dto) {
    CostumeEntity entity = new CostumeEntity();
    entity.setName(dto.getName());
    entity.setDetail(dto.getDetail());
    entity.setColour(dto.getColour());
    entity.setImage(dto.getImage());
    entity.setCreationDate(new Date());

    return entity;
  }


  public CostumeRequestDTO costumeEntity2DTO(CostumeEntity entitysaved) {
    CostumeRequestDTO dto = new CostumeRequestDTO();
    dto.setId(entitysaved.getId());
    dto.setName(entitysaved.getName());
    dto.setDetail(entitysaved.getDetail());
    dto.setColour(entitysaved.getColour());
    dto.setImage(entitysaved.getImage());
    dto.setCreationDay(String.valueOf(entitysaved.getCreationDate()));
    dto.setStatus(String.valueOf(entitysaved.getStatus()));

    return dto;
  }

  public CostumeDetailDTO costumeDetailEntity2DTO(CostumeEntity entity) {
    CostumeDetailDTO dto = new CostumeDetailDTO();
    dto.setId(entity.getId());
    dto.setName(entity.getName());
    dto.setDetail(entity.getDetail());
    dto.setImage(entity.getImage());
    dto.setColour(entity.getColour());
    dto.setStatus(String.valueOf(entity.getStatus()));
    dto.setCreationDay(String.valueOf(entity.getCreationDate()));
    if (!entity.getClients().isEmpty()) {
      ClientEntity lastClient = entity.getClients().stream()
          .max(Comparator.comparing(ClientEntity::getLastRentedDate))
          .orElseThrow(NoSuchElementException::new);
      dto.setLastClientRented(lastClient.getName());
    } else {
      dto.setLastClientRented("Este disfraz todavia no se alquiló");
    }

    return dto;
  }

  public List<CostumeTableDTO> costumeTableEntityList2DTO(List<CostumeEntity> entities) {
    List<CostumeTableDTO> dtos = new ArrayList<>();
    for (CostumeEntity entity : entities) {
      dtos.add(costumeTableEntity2DTO(entity));
    }
    return dtos;

  }

  private CostumeTableDTO costumeTableEntity2DTO(CostumeEntity entity) {
    CostumeTableDTO dto = new CostumeTableDTO();
    dto.setName(entity.getName());
    dto.setDetail(entity.getDetail());
    dto.setCostumeStatus(entity.getStatus());
    if (entity.getStatus().equals(CostumeStatus.ALQUILADO)||
        entity.getStatus().equals(CostumeStatus.RESERVADO)) {
      dto.setDeadlineDate(entity.getDeadLine());
      dto.setReservationDate(entity.getReservationDate());
      ClientEntity lastClient = entity.getClients().stream()
          .max(Comparator.comparing(ClientEntity::getLastRentedDate))
          .orElseThrow(NoSuchElementException::new);
      dto.setClientRented(lastClient.getName());
    }
    return dto;
  }

  public void costumeUpdateEntity2DTO(CostumeEntity entity, CostumeRequestDTO costumeDTO) {
    entity.setName(costumeDTO.getName());
    entity.setColour(costumeDTO.getColour());
    entity.setDetail(costumeDTO.getDetail());
    entity.setImage(costumeDTO.getImage());
  }
}