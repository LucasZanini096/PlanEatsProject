package planEatsBackend.entities;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("ADMIN")
public class Admin extends Usuario {
    
  // Chave do administrador
  @Column(name = "admin_key")
  private String adminKey;

  public String getAdminKey() {
    return adminKey;
  }

  public void setAdminKey(String adminKey) {
    this.adminKey = adminKey;
  }
  

}