# Interior API Guide

This backend is a Spring Boot application with JWT auth, MySQL for runtime, and H2 for tests.

## Authentication

- `POST /api/users/signup` - public - body: `name`, `email`, `password`
- `POST /api/users/signin` - public - body: `email`, `password`
- `POST /api/users/signinByGoogle` - public - body: `token`, `name`, `email`
- `POST /api/users/signinByFacebook` - public - body: `token`, `name`, `email`
- `GET /api/users/verify-email?token=...` - public
- `PUT /api/users/change-password` - bearer token - body: `oldPassword`, `newPassword`
- `POST /api/auth/send?email=...` - public - create reset token and send email if mail is configured
- `POST /api/auth/reset-password/{token}` - public - body: `newPassword`

Auth responses return `{ accessToken, user }`.

## Users

- `GET /api/users/{id}` - public
- `GET /api/users` - admin
- `PUT /api/users/{id}/promote` - admin
- `PUT /api/users/{id}/block` - admin

## Categories

- `GET /api/category` - public
- `GET /api/category/{id}` - public
- `POST /api/category` - admin
- `PUT /api/category/{id}` - admin
- `DELETE /api/category/{id}` - admin

## Banners

- `GET /api/banner` - public
- `POST /api/banner` - admin, multipart field: `image`
- `PUT /api/banner/{id}` - admin, multipart field: `image`
- `DELETE /api/banner/{id}` - admin

## Products

- `GET /api/product?page=0&size=20&search=` - public
- `GET /api/product/{id}` - public
- `GET /api/product/category/{id}` - public
- `GET /api/product/cart/{id}` - public
- `POST /api/product` - admin, multipart field `data` as JSON + optional `images[]`
- `PUT /api/product/{id}` - admin, multipart field `data` as JSON + optional `images[]`
- `DELETE /api/product/{id}` - admin

### Variants

- `POST /api/product/variant/{id}` - admin, multipart field `data` as JSON + optional `image`
- `PUT /api/product/variant/{productId}/{variantId}` - admin, multipart field `data` as JSON + optional `image`
- `DELETE /api/product/variant/{id}` - admin

## Cart

- `GET /api/cart` - bearer token - returns current cart
- `POST /api/cart` - bearer token - add item to current cart
- `PUT /api/cart` - bearer token - update cart item
- `DELETE /api/cart/{id}` - bearer token - remove cart item

## Addresses

- `GET /api/address` - bearer token - list my addresses
- `GET /api/address/{id}` - public
- `POST /api/address` - bearer token - body: address fields
- `PUT /api/address/{id}` - bearer token - body: address fields
- `DELETE /api/address/{id}` - bearer token

## Orders

- `POST /api/order` - bearer token - body: `addressId`, `paymentMethod`
- `POST /api/order/create-vnpay` - bearer token - same body as above
- `GET /api/order` - bearer token - my orders
- `GET /api/order/vnpay_ipn` - public
- `GET /api/order/admin` - admin
- `GET /api/order/admin/user/{id}` - admin
- `GET /api/order/admin/{id}` - admin
- `PUT /api/order/admin/{id}` - admin

### Staff

- `GET /api/staff/orderToday` - staff/admin
- `GET /api/staff/{id}` - staff/admin
- `POST /api/staff` - staff/admin - body: `orderId`, `status`

## Email

- `POST /api/email` - public - body: `name`, `email`, `message`

## Notes

- Uploaded images are stored in Cloudinary when configured.
- If Cloudinary is not configured, uploads fall back to local files under `uploads/` and are served from `/uploads/**`.
- Spring Security uses JWT Bearer tokens and role checks for `ADMIN` and `STAFF` routes.