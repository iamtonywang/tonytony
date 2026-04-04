최종 SSOT / DDL 기준서 (정밀 완성본 · 충돌 제거 반영본)
1. 문서 목적
이 문서는 현재 확정된 서비스의 DB 구조, 도메인 규칙, 보안 정책, 페이지 구조, 렌더링 원칙, 데이터 흐름 원칙을 하나의 기준으로 고정하기 위한 최종 기준서다.
이 문서는 다음 목적을 가진다.
첫째, Supabase DDL 생성 시 순서와 구조가 절대 흔들리지 않도록 고정한다.
둘째, 홈페이지 / 마이페이지 / 관리자 페이지를 구현할 때 DB 구조와 UI 구조가 어긋나지 않도록 한다.
셋째, 주문 / 결제 / 환불 / 정산 / 귀속 구조에서 발생할 수 있는 꼬임을 사전에 차단한다.
넷째, 이후 수정 시 무엇을 절대 바꾸면 안 되는지 명확히 남긴다.
다섯째, FK / partial unique / domain integrity / RLS / policy / 삭제 금지 트리거의 위치를 혼동하지 않도록 블록 책임을 고정한다.
이 문서의 모든 규칙은 추측이 아니라 지금까지 확정한 구조 기준이다.
2. 최상위 설계 원칙
2.1 시스템 전체 원칙
이 서비스는 단순 CRUD 구조가 아니라 상태 전이와 이력 보존을 중심으로 설계한다.
주문은 수정 대상이 아니라 상태 전이 대상이다.
결제는 단일 값이 아니라 이력이다.
환불은 부분환불 없이 전체 환불 기준으로 관리한다.
정산은 주문에 종속되지만 주문과 분리된 독립 기록으로 관리한다.
고객 귀속은 최초 1회 확정 후 영구 유지한다.
핵심 이력 테이블은 물리 삭제하지 않고 상태값 또는 이력 보존 기준으로 관리한다.
2.2 홈페이지 전체 원칙
홈페이지는 반드시 가벼워야 한다.
첫 화면은 즉시 보여야 한다.
초기 렌더를 무겁게 만드는 구조는 금지한다.
공통 영역은 정적 구조를 유지한다.
페이지 진입 시 데이터는 상위에서 1회만 집약 조회한다.
하위 섹션은 props 기반 렌더만 수행한다.
게시판, 정산 목록, 문의 목록, 이미지 갤러리, 문서/PDF, 대량 테이블은 초기 렌더에서 제외하고 후순위 로딩한다.
2.3 데이터 처리 원칙
금액 계산은 클라이언트에서 하지 않는다.
권한 판정은 클라이언트에서 하지 않는다.
상태 전이는 클라이언트에서 하지 않는다.
모든 핵심 판정은 서버 기준이다.
3. DDL 블록 생성 순서
DDL 블록 생성 순서는 아래로 고정한다.
01_enum
02_core_tables
03_product_tables
04_order_tables
05_partner_link_tables
06_settlement_tables
07_board_tables
08_ops_tables
09_post_alter_fks
10_domain_integrity_rules
11_indexes
12_rls_enable
13_policies
14_domain_integrity
이 순서를 바꾸면 안 된다.
이 순서의 이유는 다음과 같다.
3.1 01_enum
모든 상태값/type 값을 먼저 고정한다.
테이블 생성 전에 enum이 있어야 컬럼 선언이 안전하다.
3.2 02_core_tables
사용자 / 관리자 / 파트너 핵심 엔티티를 먼저 만든다.
이후 주문 / 정산 / 게시판 / 운영의 대부분이 이 축을 참조한다.
3.3 03_product_tables
상품 기본 구조를 먼저 만든다.
이후 order_items / reviews / inquiries가 products를 참조한다.
3.4 04_order_tables
주문 / 결제 / 환불 / 결제이벤트 축을 만든다.
정산, 리뷰 구매근거, 귀속확정, 운영 로깅의 기준이 된다.
3.5 05_partner_link_tables
고객 귀속 테이블을 주문축 이후에 만든다.
first_order_id를 후행 FK로 붙이기 쉽게 하기 위함이다.
3.6 06_settlement_tables
정산 / 계좌 / 정산요청 / 포인트 축을 만든다.
orders / partners가 먼저 있어야 안전하다.
3.7 07_board_tables
리뷰 / 문의는 products / users / orders를 참조하므로 뒤에 둔다.
3.8 08_ops_tables
운영 / 집계 테이블은 도메인 핵심 생성 후 뒤에 붙인다.
3.9 09_post_alter_fks
생성 순서상 바로 못 붙였던 FK를 뒤에서 부착한다.
3.10 10_domain_integrity_rules
FK/check만으로 못 막는 도메인 무결성 규칙을 붙인다.
예: 구매근거 리뷰 검증, 귀속 검증, subtotal 검증, 빈 주문 금지
3.11 11_indexes
partial unique 및 조회 인덱스를 뒤에서 붙인다.
테이블과 FK가 모두 생성된 뒤가 가장 안전하다.
3.12 12_rls_enable
테이블이 다 준비된 뒤 RLS를 켠다.
3.13 13_policies
RLS 정책을 마지막 보안 단계에서 붙인다.
3.14 14_domain_integrity
최종 교차 무결성 + 물리삭제 금지 트리거를 가장 마지막에 붙인다.
중간에 붙이면 생성 / 적재 도중 불필요하게 막힐 수 있다.
4. ENUM 최종 고정값
4.1 계정 / 관리자
user_status = active | blocked | withdrawn
admin_role = super_admin | operator | settlement_manager | cs_manager
admin_status = active | inactive
4.2 파트너
application_status = pending | approved | rejected | blocked
partner_status = active | inactive | blocked
4.3 상품
product_status = draft | active | inactive | sold_out
media_type = hero_image | gallery_image | certification_image | document_file
4.4 주문 / 결제 / 환불
order_status = pending | paid | preparing | shipped | completed | cancelled | refunded
payment_status = pending | success | failed | cancelled | refunded
refund_status = requested | approved | rejected | completed
4.5 정산 / 요청 / 포인트
settlement_status = pending | confirmed | paid | cancelled
request_status = pending | approved | rejected | paid
change_type = settlement | reward | use | withdrawal | adjustment
4.6 게시판
review_status = active | hidden | deleted
inquiry_status = active | answered | hidden | deleted
중요하다.
settlement_status에 reserved는 없다.
change_type에는 반드시 reward, use가 포함된다.
status/type은 전부 enum으로 고정한다.
5. 블록별 포함 테이블 최종 고정
5.1 02_core_tables
users
user_profiles
admins
partner_applications
partners
partner_codes
5.2 03_product_tables
products
product_prices
product_information
product_media
5.3 04_order_tables
orders
order_items
payments
refunds
payment_events
5.4 05_partner_link_tables
customer_partner_links
5.5 06_settlement_tables
settlements
partner_bank_accounts
partner_settlement_requests
partner_settlement_request_items
partner_points
partner_point_logs
5.6 07_board_tables
reviews
inquiries
5.7 08_ops_tables
audit_logs
page_metrics
signup_metrics
sales_metrics
6. 인증 / 회원 / 프로필 구조
6.1 인증 구조 원칙
비밀번호와 세션은 Supabase Auth가 관리한다.
verification(이메일 확인 / SMS OTP)은 사용하지 않는다. 가입 직후 즉시 사용 가능한 계정을 생성한다.
authentication은 Supabase Auth가 담당하며 역할은 비밀번호 검증과 세션 생성으로 한정한다.
이메일(email)은 Auth 인증 식별축으로 사용한다.
phone은 인증 수단이 아니라 회원 정보 입력 항목이다.
우리 서비스의 users 테이블은 비밀번호 저장 테이블이 아니다.
즉 구조는 다음과 같다.
Auth
→ auth_user_id(UUID) 생성
→ users.auth_user_id 로 연결
→ users.id(bigint)를 내부 관계 PK로 사용
6.2 회원가입 구조
초기 회원가입은 아래 최소 정보를 받는다.
회원가입 시 입력:
login_id
password
phone
email
회원가입 시 저장:
auth_user_id
login_id
phone
email
user_status
초기 회원가입 시 저장하지 않는 것:
real_name
zipcode
address1
address2
6.3 추가 정보 입력 구조
email / real_name / address는 회원가입 단계에서 강제하지 않는다.
이 정보는 구매 시점 또는 마이페이지 정보 수정 시점에 후행 입력된다.
6.4 users 역할
users는 계정 원본이다.
auth_user_id
login_id
phone
email
user_status
last_login_at
을 보관한다.
phone과 email 원본은 users에 있다.
6.5 user_profiles 역할
user_profiles는 실명과 주소를 보관하는 1:1 보조 테이블이다.
real_name
zipcode
address1
address2
를 보관한다.
phone / email는 user_profiles에 두지 않는다.
6.6 화면 표시 기준
UUID(auth_user_id)는 내부 연결용이다.
화면에 절대 노출하지 않는다.
화면 식별 기준은 login_id / phone / email / real_name / 주소다.
6.7 로그인 구조 원칙
로그인 화면 입력 UX는 login_id + password를 유지한다.
실제 인증 흐름은 login_id → (서버 축의 안전한 조회 구조 필요) → email 확보 → Auth(email + password) 로그인으로 한다.
public.users.user_status는 로그인 전 선판정한다(서버 축). Auth 메타데이터(raw_user_meta_data)는 핵심 판정 기준으로 사용하지 않는다.
6.8 로그인용 보안 조회 RPC 기준
서버 전용 선판정 조회 RPC가 존재한다(로그인용).
입력값은 login_id 1개다.
반환값은 email, user_status 2개만 가진다.
서버는 이 조회 결과로 user_status를 먼저 판정하고, active일 때만 Auth(email + password) 인증으로 연결한다.
미존재 / 중복 / email 없음은 로그인 차단 대상으로 간주한다.
해당 RPC는 비밀번호 검증/세션 생성 책임이 없다.
6.9 회원가입 저장 경로(보안)
회원가입 시 public.users insert는 SECURITY DEFINER 함수(create_user_after_signup)를 통해서만 수행한다.
route에서 direct insert는 금지하며, RLS 우회를 위해 해당 함수를 사용한다.
7. 관리자 권한 구조
admins는 별도 로그인 계정 테이블이 아니다.
users 중 일부에 관리자 역할을 추가 부여하는 구조다.
즉 관계는 다음이다.
users에만 있으면 일반 유저
users + admins면 관리자
admins는 다음을 가진다.
user_id unique
admin_role
admin_status
granted_at
admin_status = active 인 경우만 실제 관리자 권한이 있다.
권한 판정은 다음 축으로 한다.
auth.uid()
→ users.auth_user_id
→ users.id
→ admins.user_id
8. 파트너 구조
8.1 신청 자격
파트너 신청은 로그인한 본인만 가능하다.
그리고 아래 조건을 동시에 만족하는 경우에만 신청 가능하다.
본인 주문이 최소 1건 존재
그 주문은 구매 인정 상태여야 함
그 주문에 환불 승인/완료 이력이 없어야 함
구매 인정 주문 상태는 아래로 고정한다.
paid
preparing
shipped
completed
아래 환불 상태가 붙은 주문은 신청 자격 주문으로 인정하지 않는다.
approved
completed
즉 환불 승인 또는 환불 완료 이력이 있는 유저는 파트너 신청 불가다.
8.2 신청과 실제 파트너의 분리
partner_applications는 신청 이력이다.
partners는 실제 승인 완료된 파트너 실체다.
이 둘은 절대 혼동하면 안 된다.
partner_applications
→ 신청 상태 추적
partners
→ 실제 운영 상태 추적
8.3 partner_applications
한 사용자는 여러 신청 이력을 가질 수 있다.
하지만 동시에 pending 신청은 1건만 허용한다.
application_status 값:
pending
approved
rejected
blocked
pending 상태는 reviewed_by_admin_id / reviewed_at 이 없어야 한다.
approved / rejected / blocked 상태는 reviewed_by_admin_id / reviewed_at 이 있어야 한다.
8.4 partners
partners는 승인된 파트너 실체다.
한 사용자당 1개만 가진다.
partner_status 값:
active
inactive
blocked
active는 정상 운영 상태다.
inactive는 종료 / 비활성 상태다.
blocked는 운영 차단 상태다.
inactive / blocked 시 파트너 레코드는 삭제하지 않는다.
상태만 바꾸고 기존 정산 / 귀속 / 주문 기록은 유지한다.
중요 고정 규칙:
partners.approved_by_admin_id는 02_core_tables에서 컬럼만 생성한다.
이 컬럼의 FK는 02에서 바로 붙이지 않는다.
생성 순서상 이 FK는 09_post_alter_fks에서 후행 부착한다.
즉 정리하면 다음과 같다.
컬럼 생성 위치: 02_core_tables
FK 부착 위치: 09_post_alter_fks
8.5 partner_codes
partner_codes는 추천 코드 이력 테이블이다.
한 파트너는 여러 코드 이력을 가질 수 있다.
하지만 실제 활성 코드는 1개만 허용한다.
즉partner_id 기준 is_active = true 1건만 허용
이 제약은 partial unique로 처리한다.
partners.partner_status = inactive 또는 blocked로 변경되면 해당 파트너의 활성 코드는 비활성화해야 한다.
9. 고객 귀속 구조
customer_partner_links는 고객의 최초 파트너 귀속을 영구 기록하는 테이블이다.
핵심 원칙은 다음과 같다.
고객 1명은 최대 1개 파트너에만 귀속된다.
귀속 후 변경하지 않는다.
물리 삭제하지 않는다.
customer_partner_links는 다음 핵심 컬럼을 가진다.
user_id unique
partner_id
partner_code_id nullable
referral_code_snapshot
linked_at
first_order_id nullable
partner_code_id와 first_order_id는 단순 FK만으로 충분하지 않다.
후행 도메인 무결성 검증이 반드시 필요하다.
검증 기준:
partner_code_id가 같은 partner_id 소유인지
first_order_id가 같은 user의 주문인지
first_order_id의 partner_id가 귀속 partner와 일치하는지
referral_code_snapshot은 소문자 기준으로 저장하며 공백을 허용하지 않는다.
10. 상품 구조
10.1 products
products는 상품 기본 엔티티다.
공개 노출과 진입 기준을 담당한다.
공개 노출 조건은 다음 두 개를 동시에 만족해야 한다.
is_visible = true
product_status in ('active', 'sold_out')
draft / inactive는 공개 대상이 아니다.
10.2 product_prices
product_prices는 가격 이력 테이블이다.
활성 가격은 상품당 1건만 허용한다.
금액 공식:
final_price_amount = price_amount - discount_amount
이 활성 1건 제약은 테이블 제약이 아니라 partial unique index로 11_indexes에서 처리한다.
10.3 product_information
product_information은 상품별 1:1 상세 본문 테이블이다.
제품 상세 페이지의 InformationSection 기준 데이터다.
위치 원칙은 반드시 다음 순서를 따른다.
HeroSection
CoreInfoSection
CTASection
BoardSection
InformationSection
즉 InformationSection은 BoardSection 아래다.
10.4 product_media
product_media는 다건 미디어 테이블이다.
대표 이미지, 갤러리, 인증 이미지, 문서를 관리한다.
동일 product_id + media_type 기준 활성 대표 미디어는 1건만 허용한다.
이 제약도 partial unique index로 11_indexes에서 처리한다.
11. 주문 구조
11.1 orders 역할
orders는 주문의 기준 테이블이다.
이후 결제 / 환불 / 정산 / 관리자 운영의 중심이 된다.
11.2 orders 핵심 필드
user_id
partner_id nullable
referral_code nullable
order_number unique
order_status
payment_status
currency
subtotal_amount
discount_amount
final_amount
is_point_payment
point_used_amount
그리고 주문자 / 수령자 / 주소 스냅샷을 반드시 가진다.
buyer_login_id_snapshot
buyer_real_name_snapshot
buyer_phone_snapshot
buyer_email_snapshot
receiver_name
receiver_phone
receiver_email
zipcode
address1
address2
11.3 스냅샷 원칙
users / user_profiles가 나중에 바뀌어도 orders의 스냅샷은 절대 바꾸지 않는다.
이 원칙이 있어야 주문 / 환불 / 정산 / 관리자 추적이 안 꼬인다.
11.4 포인트 결제 규칙
포인트는 부분결제를 허용하지 않는다.
전액결제만 허용한다.
일반 결제:
is_point_payment = false
point_used_amount = 0
final_amount > 0
포인트 전액결제:
is_point_payment = true
point_used_amount = subtotal_amount - discount_amount
final_amount = 0
11.5 금액 공식
final_amount = subtotal_amount - discount_amount - point_used_amount
11.6 상태 구조
order_status:
pending | paid | preparing | shipped | completed | cancelled | refunded
payment_status:
pending | success | failed | cancelled | refunded
11.7 후행 무결성
빈 주문 금지
order_items 합계 = subtotal_amount
진행 주문은 success payment 필요
refunded 주문은 refunded payment + completed refund 필요
partner_id는 주문 생성 시 서버에서 확정하고 이후 변경 불가다.
12. order_items 구조
order_items는 주문 시점 상품 / 가격 스냅샷을 고정하는 테이블이다.
필수 원칙:
quantity > 0
unit_price >= 0
line_total_amount >= 0
line_total_amount = round(unit_price * quantity, 2)
orders.subtotal_amount는 sum(order_items.line_total_amount)와 같아야 한다.
product_id는 참조용이며 실제 표시 / 정산 기준은 snapshot 값 기준이다.
주문 이후 order_items 수정은 금지한다.
13. payments 구조
payments는 단일 결과가 아니라 결제 이력 테이블이다.
한 주문에 여러 payment 이력이 있을 수 있다.
success / refunded 이력 공존은 허용된다.
이력 보존이 목적이기 때문이다.
핵심 필드:
order_id
payment_method
payment_provider nullable
transaction_id nullable
payment_status
requested_amount
approved_amount nullable
failure_reason nullable
requested_at
approved_at nullable
cancelled_at nullable
refunded_at nullable
transaction_id는 nullable이지만 값이 있을 때만 unique여야 한다.
즉 partial unique가 필요하다.
이 제약은 11_indexes에서 처리한다.
클라이언트는 결제 상태를 확정하지 않는다.
모든 상태 전이는 서버 기준이다.
14. refunds 구조
refunds는 환불 요청 / 승인 / 거절 / 완료 이력 테이블이다.
refund_status:
requested | approved | rejected | completed
핵심 원칙:
부분환불 없음
전체 환불 기준
payment_id가 있으면 같은 order의 payment여야 함
completed refund와 requested/approved refund 공존 금지
rejected 이력은 공존 허용
refund completed 시
orders.order_status = refunded
orders.payment_status = refunded
반영 구조를 따른다.
15. payment_events 구조
payment_events는 PG/Webhook 이벤트 원본 적재 테이블이다.
이 테이블은 일반 기능 테이블이 아니다.
service-role only 기준이다.
핵심 원칙:
RLS enable
정책 미작성
일반 사용자 접근 없음
일반 관리자 접근 없음
provider_event_id는 nullable이지만 값이 있을 때만 unique여야 한다.
이 제약은 partial unique index로 처리한다.
payment_events는 물리 삭제 금지 대상이다.
16. settlements 구조
16.1 역할
settlements는 파트너 정산 기록 테이블이다.
파트너 귀속 주문에 대해서만 생성된다.
16.2 생성 조건
주문이 정산 대상 조건을 만족해야 한다.
partner_id 존재
partner_status = active
partner_code.is_active = true
포인트 전액결제 주문 아님
조건 불만족 시 settlement를 만들지 않는다.
그 주문은 회사 매출로 처리한다.
16.3 settlement_status
pending
confirmed
paid
cancelled
reserved는 없다.
16.4 핵심 시간 구조
settlement_available_at = 결제 완료 + 14일
settlement_confirmed_at
settlement_paid_at
cancelled_at
16.5 상태 흐름
결제 성공 주문
→ settlement 생성
→ pending
→ 14일 경과
→ confirmed
→ 지급 완료
→ paid
14일 이내 전체 환불
→ cancelled
confirmed 이후 환불
→ 자동 취소 금지
→ 관리자 조정
16.6 settlement_rate
nullable 아님
기준 default 0.1000
16.7 계산식
settlement_amount = round(base_order_amount * settlement_rate, 2)
settlement는 주문 기준 비용 기록이며 임의 재귀속 / 재계산을 금지한다.
17. 정산 요청 / 계좌 / 포인트 구조
17.1 partner_bank_accounts
파트너 정산 계좌 기준 테이블이다.
파트너당 1개만 허용한다.
중요 고정 규칙:
partner_settlement_requests에서 (bank_account_id, partner_id) 복합 FK를 사용하기 위해
parent인 partner_bank_accounts에는 (id, partner_id) unique 보강이 필요하다.
즉 이 구조는 다음을 포함해야 한다.
partner_bank_accounts
→ partner_id unique
→ 추가로 (id, partner_id) unique 보강
이 보강 후
partner_settlement_requests(bank_account_id, partner_id)
→ partner_bank_accounts(id, partner_id)
복합 FK를 부착한다.
단일 bank_account_id FK만으로 끝내는 구조는 사용하지 않는다.
17.2 partner_settlement_requests
지급 요청 이력을 보관한다.
settlements 자체와는 분리된 요청 엔티티다.
bank_account_id는 필수다.
반드시 같은 partner 소유 계좌여야 한다.
동일 파트너는 동시에 pending 요청 1건만 허용한다.
요청 상태값은 아래로 고정한다.
pending
approved
rejected
paid
processed_by_admin_id는 06이 아니라 09_post_alter_fks에서 FK를 후행 부착한다.
17.3 partner_settlement_request_items
지급 요청에 포함된 settlement 목록을 관리한다.
settlement_id unique
즉 settlement 1건은 request_item 최대 1건
후행 검증:
request.partner_id = settlement.partner_id
amount_snapshot = settlement_amount
17.4 partner_points
현재 포인트 집계 테이블이다.
current_balance
total_earned
total_used
total_withdrawn
를 가진다.
17.5 partner_point_logs
포인트 변동 이력 테이블이다.
change_type:
settlement | reward | use | withdrawal | adjustment
change_amount != 0
balance_after >= 0
18. 게시판 구조
18.1 reviews
reviews는 구매근거 기반 제품 리뷰 테이블이다.
필수 조건:
review.user_id = order.user_id
order_items 안에 해당 product_id 존재
refund_status in (approved, completed) 이면 작성 금지
비밀글 가능
is_private 필요
물리 삭제 금지
review_status로 상태 관리
리뷰는 제품 상세 초기 렌더에 포함하지 않는다.
BoardSection 후순위 lazy/CSR 로딩 구조에서 표시한다.
18.2 inquiries
inquiries는 로그인 사용자 기준 제품 문의 이력 테이블이다.
작성: 로그인 사용자
조회: 작성자 본인 또는 관리자
비밀글 가능
is_private 필요
answered 상태면
answer_content / answered_by_admin_id / answered_at 필수
물리 삭제 금지
inquiry_status로 상태 관리
19. 운영 / 감사 / 집계 구조
19.1 audit_logs
audit_logs는 admin / user / system 주체의 운영 변경 이력을 기록한다.
핵심 필드:
actor_type = system | admin | user
actor_admin_id nullable
actor_user_id nullable
target_table
target_id
action_type
before_data
after_data
actor_type에 따라 actor_admin_id / actor_user_id 정합성이 맞아야 한다.
중요 고정 규칙:
audit_logs는 운영 이력 보존 원칙에 따라 물리삭제 금지 대상으로 본다.
즉 audit_logs는 08_ops_tables에서 생성되지만, 14_domain_integrity의 물리삭제 금지 트리거 대상에 포함한다.
19.2 page_metrics / signup_metrics / sales_metrics
이 3개는 원천 트랜잭션 테이블이 아니라 집계 테이블이다.
관리자 조회 전용이다.
원천 거래 테이블과 직접 FK로 강결합하지 않는다.
20. 생성 시 즉시 붙일 FK 최종 고정
아래 FK는 해당 시점에 선행 테이블이 이미 존재하므로 즉시 부착한다.
20.1 core / product / order
user_profiles.user_id → users.id
admins.user_id → users.id
partner_applications.user_id → users.id
partners.user_id → users.id
partner_codes.partner_id → partners.id
product_prices.product_id → products.id
product_information.product_id → products.id
product_media.product_id → products.id
orders.user_id → users.id
orders.partner_id → partners.id
order_items.order_id → orders.id
order_items.product_id → products.id
payments.order_id → orders.id
refunds.order_id → orders.id
refunds.requested_by_user_id → users.id
refunds(payment_id, order_id) → payments(id, order_id)
payment_events.payment_id → payments.id
20.2 partner link / settlement / board
customer_partner_links.user_id → users.id
customer_partner_links.partner_id → partners.id
settlements.order_id → orders.id
settlements.partner_id → partners.id
settlements.user_id → users.id
partner_bank_accounts.partner_id → partners.id
partner_settlement_requests.partner_id → partners.id
partner_settlement_requests(bank_account_id, partner_id) → partner_bank_accounts(id, partner_id)
partner_settlement_request_items.request_id → partner_settlement_requests.id
partner_settlement_request_items.settlement_id → settlements.id
partner_points.partner_id → partners.id
partner_point_logs.partner_id → partners.id
reviews.product_id → products.id
reviews.user_id → users.id
reviews.order_id → orders.id
inquiries.product_id → products.id
inquiries.user_id → users.id
21. 09_post_alter_fks 후행 FK 최종 고정
아래 FK는 생성 순서상 뒤에서 ALTER로 부착한다.
customer_partner_links.partner_code_id → partner_codes.id
customer_partner_links.first_order_id → orders.id
partner_applications.reviewed_by_admin_id → admins.id
partners.approved_by_admin_id → admins.id
partner_codes.issued_by_admin_id → admins.id
refunds.processed_by_admin_id → admins.id
partner_settlement_requests.processed_by_admin_id → admins.id
inquiries.answered_by_admin_id → admins.id
audit_logs.actor_admin_id → admins.id
audit_logs.actor_user_id → users.id
팩트:
후행 FK는 생성 순서 해결용이다.
비즈니스 교차 검증은 여기서 하지 않고 10 / 14 블록에서 처리한다.
22. 10_domain_integrity_rules 최종 포함 규칙
이 블록은 FK/check만으로 못 막는 구조를 보강한다.
22.1 customer_partner_links 교차 검증
partner_code_id가 존재하면 같은 partner_id 소유인지 검증
first_order_id가 존재하면 같은 user_id 주문인지 검증
first_order_id.partner_id가 귀속 partner_id와 일치하는지 검증
22.2 reviews 구매근거 검증
review.user_id = order.user_id
해당 order_id의 order_items에 해당 product_id 존재
refund_status in (approved, completed) 이면 리뷰 작성 금지
22.3 partner_settlement_request_items 검증
request.partner_id = settlement.partner_id
amount_snapshot = settlement_amount
22.4 orders subtotal 검증
orders.subtotal_amount = sum(order_items.line_total_amount)
22.5 빈 주문 금지
order_items 없는 orders 금지
이 블록이 빠지면 현재 구조는 완성되지 않는다.
23. 11_indexes 최종 포함 범위
23.1 partial unique
partner_codes: partner_id 기준 is_active = true 1건
product_prices: product_id 기준 is_active = true 1건
product_media: product_id + media_type 기준 is_primary = true and is_active = true 1건
partner_applications: user_id 기준 pending 1건
partner_settlement_requests: partner_id 기준 pending 1건
payments.transaction_id: is not null unique
payment_events.provider_event_id: is not null unique
23.2 조회 성능 인덱스 핵심
orders(user_id, created_at desc)
orders(partner_id, created_at desc)
orders(order_status, created_at desc)
orders(payment_status, created_at desc)
settlements(partner_id, settlement_status, settlement_available_at)
settlements(settlement_status, settlement_available_at)
reviews(product_id, review_status, created_at desc)
inquiries(product_id, inquiry_status, created_at desc)
그리고 product / payment / refund / point log / settlement request 계열 조회 인덱스를 포함한다.
팩트:
partial unique는 FK가 아니라 인덱스다.
따라서 반드시 테이블 생성 후 11_indexes에서 별도 생성해야 한다.
24. 12_rls_enable 최종 범위
24.1 user-facing
users
user_profiles
partner_applications
partners
partner_codes
customer_partner_links
24.2 public product
products
product_prices
product_information
product_media
24.3 order / payment / refund
orders
order_items
payments
refunds
24.4 service-role only
payment_events
24.5 settlement / partner
settlements
partner_bank_accounts
partner_settlement_requests
partner_settlement_request_items
partner_points
partner_point_logs
24.6 board
reviews
inquiries
24.7 admin / ops
admins
audit_logs
page_metrics
signup_metrics
sales_metrics
25. 13_policies 최종 원칙
25.1 기준 함수
current_user_pk()
current_partner_pk()
is_admin()
25.2 판정 축
auth.uid() ↔ users.auth_user_id
25.3 정책 분류
공개 데이터 → 공개 SELECT
개인 데이터 → 본인만
파트너 데이터 → 본인 partner 또는 admin
관리자 데이터 → admin only
payment_events → 정책 미작성, service role only
25.4 게시판 정책
reviews: 공개 active 리뷰만 전체 조회, 비밀글은 작성자 + 관리자
reviews: 구매근거 + 환불 제외 시만 작성 가능
inquiries: 작성자 + 관리자만 조회
inquiries: 비밀글도 동일하게 작성자 + 관리자만
26. 14_domain_integrity 최종 포함 규칙
26.1 orders ↔ payments
진행 주문(paid / preparing / shipped / completed)은 success payment 최소 1건 필요
refunded order는 refunded payment 필요
orders.payment_status = success면 success payment 존재 필요
orders.payment_status = refunded면 refunded payment 존재 필요
26.2 orders ↔ refunds
refunded order는 completed refund 필요
orders.payment_status = refunded도 completed refund 필요
completed refund와 requested/approved refund 공존 금지
rejected refund 이력 공존 허용
부분환불 없음
26.3 물리 삭제 금지
다음 테이블은 반드시 물리 삭제 금지다.
customer_partner_links
reviews
inquiries
orders
order_items
payments
refunds
payment_events
settlements
partner_bank_accounts
partner_settlement_requests
partner_settlement_request_items
partner_points
partner_point_logs
audit_logs
팩트:
핵심 이력성 데이터는 삭제 대신 상태 변경 / 이력 보존으로 처리한다.
27. 홈페이지 페이지 구조 최종 기준
27.1 공통 영역
Header / Footer는 기능이 아니라 프레임이다.
거의 정적 구조로 유지한다.
fetch 금지
권한 체크 금지
비즈니스 로직 금지
Header는 isLoggedIn 정도만 최소 전달 가능하다.
사용자 상세 데이터(login_id, 포인트, 주문수)는 넣지 않는다.
27.2 공개 메뉴 페이지
대상: Home / WHY / Our Work / Product
원칙:
SSR 또는 Server Component
상위 1회 fetch
Hero / 핵심 텍스트 / CTA 우선 렌더
하단 미디어 / 배너 / 확장 콘텐츠는 lazy
27.3 제품 상세 페이지
최종 구조:
HeroSection
CoreInfoSection
CTASection
BoardSection
InformationSection
원칙:
상위 1회 fetch
초기 렌더 = 상품명 / 대표이미지 / 가격 / 핵심설명 / 구매상태 / CTA
게시판, 갤러리, 인증자료, 상세정보는 후순위
BoardSection은 구조상 포함되지만 초기 렌더에는 포함하지 않는다.
27.4 구매 페이지
제품 상세와 분리된 독립 화면이다.
단일 서버 처리 흐름으로 주문 생성한다.
다중 fetch 금지
클라이언트 가격 확정 금지
주문 생성 전 검증은 모두 서버 기준
27.5 인증 페이지
CSR 폼 기준
회원가입은 login_id / password / phone / email 최소 구조
추가 정보는 구매 또는 마이페이지에서 확정
27.6 마이페이지
마이페이지는 1개 Shell로 유지한다.
일반 유저와 파트너 유저를 분리 페이지로 만들지 않는다.
상위 1회 조회:
login_id
phone
email
real_name
address
partner 여부 / 상태
AccountInfoSection에는 정보 표시 + 정보수정이 있어야 한다.
users에서 수정:
phone
email
user_profiles에서 수정:
real_name
zipcode
address1
address2
orders 스냅샷은 절대 같이 수정하지 않는다.
주문 / 환불 / 문의 / 파트너 대시보드는 초기 렌더 제외
탭 / 메뉴 진입 시 lazy fetch
27.7 관리자 페이지
AdminLayout 아래 독립 모듈 구조로 간다.
DashboardModule
UsersModule
OrdersModule
RefundsModule
PartnersModule
SettlementsModule
BoardsModule
MetricsModule
Dashboard만 서버 집약 요약
나머지 목록 / 검색 / 필터 / 페이지네이션은 CSR
UUID(auth_user_id)와 내부 bigint id를 표시 식별자로 사용하지 않는다.
28. Header 구조 최종 기준
28.1 Header 목표
Header는 모든 페이지에서 공통으로 렌더되지만 성능 병목이 되면 안 된다.
따라서 최소 데이터만 SSR에서 처리하고 공통 네비게이션 UI 역할만 담당한다.
28.2 Header 레이아웃 기준
상단 중앙: TONYWANG 로고
하단 중앙: 메뉴 목록
메뉴 예시: Our Work / WHY? / Product / Login 또는 MyPage
기본 글자색: #FFFFFF
호버 색상: #ff7f00
모바일에서는 햄버거 메뉴 구조를 사용한다.
PC와 모바일은 동일 메뉴 데이터를 공유하고 렌더 방식만 분리한다.
중요 원칙:
전역 Header에 Admin 메뉴를 직접 넣지 않는다.
전역 Header는 isAdmin까지 책임지지 않는다.
관리자 진입은 관리자 전용 페이지 / 관리자 전용 라우트 / 관리자 전용 레이아웃에서 처리한다.
28.3 Header 폴더 구조 기준
/components/sections/Header/
├─ index.tsx
├─ Header.tsx
├─ HeaderNav.tsx
├─ HeaderMobile.tsx
├─ headerMenuConfig.ts
├─ HeaderUtils.ts
└─ Header.module.css
28.4 Header 데이터 흐름 기준
RootLayout 또는 공통 상위 Layout에서 Header를 호출한다.
Header에 전달하는 값은 최소화한다.
전달 허용 기준:
isLoggedIn
전달 금지 기준:
login_id
phone
email
partner_status
point
order_count
isAdmin (전역 Header 기준)
기타 사용자 상세 정보
28.5 Header 성능 최적화 기준
Header 내부 fetch 금지
권한 체크 금지
사용자 상세 데이터 금지
알림 / 카운트 / 포인트 / 주문수 표시 금지
PC/모바일 데이터 중복 fetch 금지
복잡한 드롭다운 메뉴 금지
무거운 애니메이션 금지
절대 기준은 이것이다.
Header는 가벼운 SSR 공통 UI다.
29. 최종 절대 고정 규칙
파트너 삭제 금지, 상태만 변경
고객 귀속 영구 유지
주문 / 결제 / 환불 / 정산 / 귀속 핵심 이력 물리 삭제 금지
정산 확정 기준 = 결제 후 14일
정산 대상 없음 = 회사 매출
부분환불 없음
클라이언트 금액 계산 금지
partner_id 사후 변경 금지
orders 스냅샷 불변
UUID(auth_user_id) 화면 노출 금지
service-role 전용 테이블(payment_events) 일반 접근 금지
30. 현재 구조에서 특히 고정해야 하는 수정 반영 사항
이 기준서는 아래 3개 수정점을 반영한 완성본으로 고정한다.
partners.approved_by_admin_id
컬럼 생성 위치: 02_core_tables
FK 부착 위치: 09_post_alter_fks
partner_settlement_requests.bank_account_id + partner_id
parent인 partner_bank_accounts에 (id, partner_id) unique 보강 후
partner_settlement_requests(bank_account_id, partner_id) → partner_bank_accounts(id, partner_id)
복합 FK 부착
audit_logs
운영 이력 보존 원칙에 맞춰 14_domain_integrity 물리삭제 금지 대상에 포함
이 3개는 이후 DDL 작성 시 절대 흔들리면 안 된다.
31. 최종 한 줄 결론
이 서비스의 최종 기준은 아래로 고정한다.
DB는 이력과 무결성을 우선하고, 페이지는 독립 구조와 1회 fetch를 우선하며, 모든 핵심 판단은 서버에서 한다.
