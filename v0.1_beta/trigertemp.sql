set @count_data = 0;
set @mini = 0;
set @maxi = 0;

select count(id), min(`utc_time`), max(`utc_time`)
into @count_data, @mini, @maxi from `wegaDB`.`readingsData`;


