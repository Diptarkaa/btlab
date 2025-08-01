package com.bankapp.repository;

import com.bankapp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    Optional<User> findByMobile(String mobile);
    
    Optional<User> findByPan(String pan);
    
    boolean existsByEmail(String email);
    
    boolean existsByMobile(String mobile);
    
    boolean existsByPan(String pan);
    
    @Query("SELECT u FROM User u WHERE u.email = :email OR u.mobile = :mobile")
    Optional<User> findByEmailOrMobile(@Param("email") String email, @Param("mobile") String mobile);
}