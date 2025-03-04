import type { NextPage } from 'next';
import Image from "next/image";
import styles from './index.module.css';


const TrangCh:NextPage = () => {
  	return (
    		<div className={styles.trangCh}>
      			<div className={styles.headingCustomer}>
        				<div className={styles.logoLeft1Wrapper}>
          					<Image className={styles.logoLeft1Icon} width={174} height={60} alt="" src="logo.jpg" />
        				</div>
        				<div className={styles.center}>
          					<div className={styles.dropdownMenu}>
            						<div className={styles.dropdownMenu1}>
              							<div className={styles.danhMcSn}>{`Danh mục sản phẩm `}</div>
            						</div>
            						<Image className={styles.iconOption} width={6} height={10} alt="" src="Icon option.svg" />
          					</div>
          					<Image className={styles.interfaceLineXl} width={24} height={24} alt="" src="Interface / Line_Xl.svg" />
          					<div className={styles.searchbar}>
            						<div className={styles.tmKim}>Tìm kiếm</div>
            						<div className={styles.interfaceSearchMagnifyingWrapper}>
              							<Image className={styles.interfaceSearchMagnifying} width={20} height={20} alt="" src="Interface / Search_Magnifying_Glass.svg" />
            						</div>
          					</div>
        				</div>
        				<div className={styles.userUser03Parent}>
          					<Image className={styles.interfaceLineXl} width={24} height={24} alt="" src="User / User_03.svg" />
          					<Image className={styles.interfaceLineXl} width={24} height={24} alt="" src="Interface / Shopping_Cart_02.svg" />
          					<Image className={styles.interfaceLineXl} width={24} height={24} alt="" src="Interface / Star.svg" />
        				</div>
      			</div>
      			<div className={styles.menu}>
        				<b className={styles.tmKim}>TRANG CHỦ</b>
        				<b className={styles.tmKim}>TẤT CẢ SẢN PHẨM</b>
        				<b className={styles.tmKim}>KHUYẾN MÃI</b>
        				<b className={styles.tmKim}>LỊCH SỬ MUA HÀNG</b>
        				<b className={styles.tmKim}>ĐIỂM TÍCH LŨY</b>
      			</div>
    		</div>);
};

export default TrangCh;
