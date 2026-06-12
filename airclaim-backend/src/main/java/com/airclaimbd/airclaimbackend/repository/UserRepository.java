package com.airclaimbd.airclaimbackend.repository;

import com.airclaimbd.airclaimbackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByEmail(String email);

}