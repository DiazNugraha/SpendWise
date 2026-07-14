import {DatePicker} from '@/components';
import {View} from 'react-native';
import {DateType} from 'react-native-ui-datepicker';

type IDateRange = {
  startDate: DateType | Date;
  endDate: DateType | Date;
};

type IFilterValue = {
  dateRange: IDateRange;
};

type IFilterProps = {
  value: IFilterValue;
  setDateRange: (val: IDateRange) => void;
};

export const ReportFilter: React.FC<IFilterProps> = ({value, setDateRange}) => {
  return (
    <View className="flex flex-col gap-3 mt-6">
      <DatePicker
        onChange={val => {
          setDateRange({
            startDate: val.startDate,
            endDate: val.endDate ?? val.startDate,
          });
        }}
        value={value.dateRange}
      />
    </View>
  );
};
