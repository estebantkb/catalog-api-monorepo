package com.catalog.api.service;

import com.catalog.api.model.Product;
import com.catalog.api.repository.ProductRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> findAll() {
        return productRepository.findAll();
    }

    public Product findById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Product not found: " + id));
    }

    public Product save(Product product) {
        return productRepository.save(product);
    }

    public Product update(Long id, Product product) {
        Product existingProduct = findById(id);
        existingProduct.setName(product.getName());
        existingProduct.setBrand(product.getBrand());
        existingProduct.setCategory(product.getCategory());
        existingProduct.setPrice(product.getPrice());
        existingProduct.setStock(product.getStock());
        return productRepository.save(existingProduct);
    }

    public void delete(Long id) {
        productRepository.delete(findById(id));
    }
}
